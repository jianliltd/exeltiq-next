import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    const body = await req.text();
    
    // Verify webhook signature
    // Note: In production, you should set up a webhook secret in Stripe dashboard
    // and use it here: stripe.webhooks.constructEvent(body, signature, webhookSecret)
    const event = JSON.parse(body);

    console.log('Webhook event received:', event.type);

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { clientId, packageId, sessionCount } = session.metadata;

      console.log('Processing payment for client:', clientId);

      // Initialize Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get current client sessions
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('total_sessions, sessions_remaining')
        .eq('id', clientId)
        .single();

      if (clientError || !client) {
        throw new Error('Client not found');
      }

      const sessionCountNum = parseInt(sessionCount, 10);
      const newTotal = (client.total_sessions || 0) + sessionCountNum;
      const newRemaining = (client.sessions_remaining || 0) + sessionCountNum;

      // Update client sessions
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          total_sessions: newTotal,
          sessions_remaining: newRemaining,
        })
        .eq('id', clientId);

      if (updateError) {
        throw new Error(`Failed to update client: ${updateError.message}`);
      }

      console.log('Client sessions updated:', { clientId, newTotal, newRemaining });

      // Get package details
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('title, company_id')
        .eq('id', packageId)
        .single();

      if (packageError) {
        console.error('Failed to fetch package:', packageError);
        throw new Error(`Failed to fetch package: ${packageError.message}`);
      }

      // Insert revenue record
      const { error: revenueError } = await supabase
        .from('revenue')
        .insert({
          company_id: packageData.company_id,
          client_id: clientId,
          amount: session.amount_total / 100, // Convert cents to dollars
          package_type: packageData.title,
          payment_type: 'online',
        });

      if (revenueError) {
        console.error('Failed to insert revenue:', revenueError);
        throw new Error(`Failed to insert revenue: ${revenueError.message}`);
      }

      console.log('Revenue recorded:', { clientId, amount: session.amount_total / 100, packageType: packageData.title });
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
