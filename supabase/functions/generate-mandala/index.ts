
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    // Parse request body
    let reqBody;
    try {
      reqBody = await req.json()
    } catch (e) {
      console.error("Failed to parse request body:", e)
      throw new Error("Invalid request body")
    }

    const { settings, jobId } = reqBody
    console.log("Received request with settings:", settings)

    if (!settings) {
      throw new Error("No settings provided")
    }

    // Initialize Hugging Face client
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      throw new Error("Missing Hugging Face API token")
    }
    
    const hf = new HfInference(hfToken)

    // Construct mandala prompt based on settings
    let mandalaPrompt = "Create a beautiful mandala design with clear, well-defined lines"
    
    if (settings.emotions?.length > 0) {
      mandalaPrompt += ` expressing ${settings.emotions.join(", ")}`
    }
    
    if (settings.emotionalQuality) {
      mandalaPrompt += ` with a focus on ${settings.emotionalQuality}`
    }
    
    if (settings.emotionalIntensity) {
      const intensity = parseInt(settings.emotionalIntensity)
      if (intensity <= 3) {
        mandalaPrompt += ", with gentle and subtle patterns"
      } else if (intensity <= 7) {
        mandalaPrompt += ", with balanced and moderate patterns"
      } else {
        mandalaPrompt += ", with bold and intense patterns"
      }
    }

    mandalaPrompt += ". Make it a perfect mandala with intricate details and perfect symmetry."

    console.log("Using prompt:", mandalaPrompt)

    // Create an AbortController with a timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort()
      console.log("Generation timed out after 25 seconds")
    }, 25000) // 25 second timeout

    try {
      // Generate the image with timeout
      const response = await hf.textToImage({
        inputs: mandalaPrompt,
        model: "rexoscare/mandala-art-lora",
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 25, // Reduced steps for faster generation
        }
      }, { signal: controller.signal })

      clearTimeout(timeout)

      if (!response) {
        throw new Error("No response from Hugging Face API")
      }

      // Convert blob to base64
      const buffer = await response.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
      const base64 = btoa(binary)
      const imageUrl = `data:image/png;base64,${base64}`

      console.log("Successfully generated mandala")

      // Update the job with the generated image URL if jobId is provided
      if (jobId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey)
          await supabase
            .from('mandala_jobs')
            .update({ 
              status: 'completed',
              image_url: imageUrl,
              completed_at: new Date().toISOString()
            })
            .eq('id', jobId)
        }
      }

      return new Response(
        JSON.stringify({ output: [imageUrl] }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )

    } catch (apiError) {
      console.error("Hugging Face API error:", apiError)
      const errorMessage = apiError.name === 'AbortError' 
        ? 'Generation timed out after 25 seconds. Please try again.'
        : `Hugging Face API error: ${apiError.message}`
      throw new Error(errorMessage)
    }

  } catch (error) {
    console.error('Error in generate-mandala function:', error)
    
    // If there's a jobId, update the job with the error
    if (jobId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey)
        await supabase
          .from('mandala_jobs')
          .update({ 
            status: 'error',
            error: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId)
      }
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate mandala',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
