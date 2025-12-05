-- Add password column to clients table
ALTER TABLE public.clients
ADD COLUMN password TEXT;