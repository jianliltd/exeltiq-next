import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packageId, clientId, gymSlug } = await req.json();

    console.log('Creating checkout session for:', { packageId, clientId, gymSlug });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch package details
    const { data: pkg, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();

    if (packageError) {
      console.error('Package query error:', packageError);
      throw new Error(`Package not found: ${packageError.message}`);
    }

    if (!pkg) {
      console.error('Package not found for ID:', packageId);
      throw new Error('Package not found');
    }

    console.log('Package found:', pkg);

    // Fetch company info separately
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('stripe_account_id, stripe_onboarding_completed')
      .eq('id', pkg.company_id)
      .single();

    if (companyError || !company) {
      console.error('Company query error:', companyError);
      throw new Error('Gym information not found');
    }

    console.log('Company found:', { id: pkg.company_id, hasStripeAccount: !!company.stripe_account_id, onboardingCompleted: company.stripe_onboarding_completed });

    // Check if gym owner has completed Stripe Connect onboarding
    if (!company.stripe_account_id || !company.stripe_onboarding_completed) {
      throw new Error('Gym owner has not completed payment setup. Please contact the gym.');
    }

    // Fetch client details
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError || !client) {
      throw new Error('Client not found');
    }

    // Calculate platform fee (5% of total amount)
    const totalAmount = Math.round(pkg.price * 100);
    const platformFeePercent = 0.05; // 5% platform fee
    const platformFeeAmount = Math.round(totalAmount * platformFeePercent);

    // Create Stripe checkout session with connected account destination
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: pkg.title,
              description: pkg.description || `${pkg.session_count} training sessions`,
            },
            unit_amount: totalAmount, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/gym/${gymSlug}?payment=success`,
      cancel_url: `${req.headers.get('origin')}/gym/${gymSlug}?payment=cancel`,
      payment_intent_data: {
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: company.stripe_account_id,
        },
      },
      metadata: {
        clientId,
        packageId,
        sessionCount: pkg.session_count.toString(),
        companyId: pkg.company_id,
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
