
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
  try {
    // Handle CORS preflight requests first
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      })
    }

    console.log("Starting mandala generation request")
    
    // Parse request body
    const reqBody = await req.json().catch(e => {
      console.error("Failed to parse request body:", e)
      throw new Error("Invalid request body")
    })

    const { settings, jobId } = reqBody
    console.log("Received settings:", settings)

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

    // Simple prompt for better performance
    const mandalaPrompt = "Generate a simple mandala with clean lines"
    console.log("Using prompt:", mandalaPrompt)

    // Create an AbortController with a shorter timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort()
      console.log("Generation timed out")
    }, 15000) // 15 second timeout

    try {
      console.log("Starting image generation")
      const response = await hf.textToImage({
        inputs: mandalaPrompt,
        model: "rexoscare/mandala-art-lora",
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 15, // Reduced steps for faster generation
        }
      }, { signal: controller.signal })

      clearTimeout(timeout)
      console.log("Image generation completed")

      if (!response) {
        throw new Error("No response from Hugging Face API")
      }

      // Convert blob to base64
      const buffer = await response.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      const imageUrl = `data:image/png;base64,${base64}`

      if (jobId) {
        console.log("Updating job status")
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Missing Supabase credentials")
        }

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

      return new Response(
        JSON.stringify({ output: [imageUrl] }),
        { headers: corsHeaders }
      )

    } catch (apiError) {
      clearTimeout(timeout)
      console.error("API error:", apiError)
      throw new Error(apiError.name === 'AbortError' 
        ? 'Generation timed out. Please try again.'
        : `API error: ${apiError.message}`)
    }

  } catch (error) {
    console.error('Error:', error)
    
    // If there's a jobId, update the job with the error
    if (reqBody?.jobId) {
      try {
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
            .eq('id', reqBody.jobId)
        }
      } catch (dbError) {
        console.error('Failed to update job status:', dbError)
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
