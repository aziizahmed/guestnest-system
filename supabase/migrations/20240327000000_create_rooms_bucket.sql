-- Create a new storage bucket for room photos
INSERT INTO storage.buckets (id, name)
VALUES ('rooms', 'rooms')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow public access to room photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'rooms');

-- Allow authenticated users to upload room photos
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'rooms');