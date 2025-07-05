import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Upload an image file to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder name (default: 'products')
 * @returns {Promise<{url: string, path: string} | null>} - The public URL and storage path, or null if failed
 */
export const uploadImage = async (file, folder = 'products') => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured for image upload');
    return null;
  }

  try {
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomId}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} path - The storage path of the image to delete
 * @returns {Promise<boolean>} - True if successful, false if failed
 */
export const deleteImage = async (path) => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured for image deletion');
    return false;
  }

  try {
    const { error } = await supabase.storage
      .from('product-images')
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateImageFile = (file) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or WebP)';
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return 'Image file size must be less than 5MB';
  }

  return null;
};
