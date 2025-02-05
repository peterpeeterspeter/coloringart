
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
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
    console.log("Starting mandala generation request")
    
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
    
    console.log("Initializing Hugging Face client")
    const hf = new HfInference(hfToken)

    // Construct simpler mandala prompt for better performance
    let mandalaPrompt = "Generate a simple mandala with clean lines and minimal detail, perfect for coloring"
    
    if (settings.emotions?.length > 0) {
      mandalaPrompt += `, expressing ${settings.emotions.join(", ")}`
    }
    
    if (settings.emotionalQuality) {
      mandalaPrompt += `, with ${settings.emotionalQuality}`
    }

    console.log("Using prompt:", mandalaPrompt)

    // Create an AbortController with a shorter timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort()
      console.log("Generation timed out")
    }, 20000) // 20 second timeout

    try {
      console.log("Starting image generation")
      // Generate the image with timeout
      const response = await hf.textToImage({
        inputs: mandalaPrompt,
        model: "rexoscare/mandala-art-lora",
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 20, // Further reduced steps
        }
      }, { signal: controller.signal })

      clearTimeout(timeout)
      console.log("Image generation completed")

      if (!response) {
        throw new Error("No response from Hugging Face API")
      }

      // Convert blob to base64
      const buffer = await response.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
      const base64 = btoa(binary)
      const imageUrl = `data:image/png;base64,${base64}`

      // Update the job with the generated image URL if jobId is provided
      if (jobId) {
        console.log("Updating job status in database")
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
        { headers: corsHeaders }
      )

    } catch (apiError) {
      console.error("Hugging Face API error:", apiError)
      clearTimeout(timeout)
      throw new Error(apiError.name === 'AbortError' 
        ? 'Generation timed out. Please try again.'
        : `Hugging Face API error: ${apiError.message}`)
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
        headers: corsHeaders
      }
    )
  }
})
