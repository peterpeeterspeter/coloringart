import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { settings, jobId } = await req.json()
    console.log("Received request with settings:", settings)

    if (!settings) {
      throw new Error("No settings provided")
    }

    // Initialize Hugging Face client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Construct mandala prompt
    const mandalaPrompt = `Create a beautiful mandala design with the following characteristics:
      Style: ${settings.style || 'balanced and harmonious'}
      Theme: ${settings.theme || 'spiritual and meditative'}
      Make it a perfect mandala with intricate details and perfect symmetry.`

    console.log("Using prompt:", mandalaPrompt)

    // Generate the image
    const response = await hf.textToImage({
      inputs: mandalaPrompt,
      model: "rexoscare/mandala-art-lora",
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    })

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

    // Update the job with the generated image URL
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (jobId) {
      const supabase = createClient(supabaseUrl!, supabaseKey!)
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
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in generate-mandala function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate mandala',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})