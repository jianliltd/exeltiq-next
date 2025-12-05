-- Add service_category to deals table
ALTER TABLE public.deals
ADD COLUMN service_category TEXT DEFAULT 'other';

-- Add an index for better performance
CREATE INDEX idx_deals_service_category ON public.deals(service_category);