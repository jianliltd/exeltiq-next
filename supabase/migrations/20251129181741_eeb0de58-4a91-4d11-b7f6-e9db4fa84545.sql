-- Add stripe_account_id to companies table for Stripe Connect
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

-- Add stripe_onboarding_completed flag
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT false;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_stripe_account_id ON public.companies(stripe_account_id);

COMMENT ON COLUMN public.companies.stripe_account_id IS 'Stripe Connect account ID for receiving payments';
COMMENT ON COLUMN public.companies.stripe_onboarding_completed IS 'Whether gym owner has completed Stripe Connect onboarding';