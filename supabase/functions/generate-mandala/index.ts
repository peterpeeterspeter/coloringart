import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
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
    console.log("Received request with settings:", settings, "and jobId:", jobId)

    // Initialize Hugging Face client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    // Create the mandala prompt
    const mandalaPrompt = `Create a beautiful mandala design with the following characteristics: ${
      Object.entries(settings)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    }. Style: Create a detailed mandala line art in black and white, perfect for coloring. The design should be symmetrical and intricate.`

    console.log("Generated prompt:", mandalaPrompt)

    // Generate the image
    const image = await hf.textToImage({
      inputs: mandalaPrompt,
      model: "rexoscare/mandala-art-lora",
      parameters: {
        negative_prompt: "blurry, bad, text, watermark, signature, color, photorealistic",
      }
    });

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const imageUrl = `data:image/png;base64,${base64}`

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update the job with the generated image
    if (jobId) {
      const { error: updateError } = await supabaseAdmin
        .from('mandala_jobs')
        .update({
          status: 'completed',
          image_url: imageUrl,
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId)

      if (updateError) {
        console.error("Error updating job:", updateError)
        throw updateError
      }
    }

    return new Response(
      JSON.stringify({ 
        status: 'succeeded',
        output: [imageUrl]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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