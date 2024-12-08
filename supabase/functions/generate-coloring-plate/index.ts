import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { predictionId, settings } = await req.json()

    // If we have a predictionId, we're checking the status of an existing prediction
    if (predictionId) {
      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const prediction = await response.json()
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Otherwise, we're creating a new prediction
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "2a115db935d2e5c8a3d0c5d5a6a45a0a5a5d5e5c8a3d0c5d5a6a45a0a5a5d",
        input: {
          prompt: settings.prompt,
          negative_prompt: "blurry, bad, text",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }),
    })

    const prediction = await response.json()
    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})