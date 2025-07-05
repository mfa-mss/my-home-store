# Supabase Storage Setup Guide

## Step 1: Create Storage Bucket via Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Use these settings:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **Enabled** (so images are publicly accessible)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: Leave empty (will allow all image types)

## Step 2: Verify Setup

After creating the bucket, you should see:
- A bucket named `product-images` in your Storage section
- The bucket should show as "Public" 

## Step 3: Test Upload

- Go to your admin panel at `http://localhost:3000/admin`
- Try adding a new product with an image upload
- The image should upload successfully and display in the product list

## Troubleshooting

If you encounter issues:

1. **Upload fails**: Check that the bucket exists and is public
2. **Images don't display**: Verify the bucket is public and check Next.js config
3. **File size errors**: Ensure files are under 5MB

## Alternative: Manual SQL Setup

If you prefer SQL commands, run the contents of `database/storage-setup.sql` in your Supabase SQL editor.

## Security Notes

- The current setup allows public uploads for simplicity
- In production, consider restricting uploads to authenticated admin users
- You can add authentication to the admin panel for better security
