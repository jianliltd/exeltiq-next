-- Add foreign key relationship between deal_notes.created_by and profiles
ALTER TABLE public.deal_notes
ADD CONSTRAINT deal_notes_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;