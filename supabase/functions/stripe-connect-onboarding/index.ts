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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's company
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      throw new Error('No company found for user');
    }

    const { data: company } = await supabase
      .from('companies')
      .select('stripe_account_id, email, name')
      .eq('id', profile.company_id)
      .single();

    if (!company) {
      throw new Error('Company not found');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    let accountId = company.stripe_account_id;

    // Create Stripe Connect account if it doesn't exist
    if (!accountId) {
      console.log('Creating new Stripe Connect account');
      const account = await stripe.accounts.create({
        type: 'express',
        email: company.email || undefined,
        business_type: 'individual',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          company_id: profile.company_id,
          company_name: company.name,
        },
      });

      accountId = account.id;

      // Save account ID to database
      const { error: updateError } = await supabase
        .from('companies')
        .update({ stripe_account_id: accountId })
        .eq('id', profile.company_id);

      if (updateError) {
        console.error('Failed to save Stripe account ID:', updateError);
        throw new Error('Failed to save Stripe account ID');
      }

      console.log('Stripe Connect account created:', accountId);
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${req.headers.get('origin')}/gym?stripe_refresh=true`,
      return_url: `${req.headers.get('origin')}/gym?stripe_complete=true`,
      type: 'account_onboarding',
    });

    console.log('Account link created for:', accountId);

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in stripe-connect-onboarding:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
