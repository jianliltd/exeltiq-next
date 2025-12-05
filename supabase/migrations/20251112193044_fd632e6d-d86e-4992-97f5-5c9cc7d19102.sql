-- Add schedule_date column to bookings table
ALTER TABLE public.bookings
ADD COLUMN schedule_date DATE;