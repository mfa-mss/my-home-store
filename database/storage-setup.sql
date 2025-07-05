-- Storage bucket setup for image uploads
-- Run these commands in your Supabase SQL editor

-- 1. Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- 2. Create a policy to allow public uploads (for admin)
-- Note: In production, you might want to restrict this to authenticated admin users
CREATE POLICY "Allow public uploads to product-images bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images'
);

-- 3. Create a policy to allow public viewing of images
CREATE POLICY "Allow public viewing of product images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'product-images'
);

-- 4. Create a policy to allow deletion of images (for admin)
CREATE POLICY "Allow deletion of product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images'
);

-- Verify the bucket was created successfully
SELECT * FROM storage.buckets WHERE id = 'product-images';

-- View bucket policies
SELECT * FROM storage.policies WHERE bucket_id = 'product-images';
