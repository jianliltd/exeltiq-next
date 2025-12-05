-- Allow public SELECT access to packages (similar to gym schedules)
-- This enables unauthenticated users on the gym booking page to view available packages
CREATE POLICY "Public can view packages"
ON packages FOR SELECT
USING (true);