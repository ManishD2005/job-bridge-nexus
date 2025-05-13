
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param path The path within the bucket (usually user ID)
 * @returns The public URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string
): Promise<string | null> => {
  try {
    // Create a unique file name to prevent overwriting
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Error uploading file. Please try again.');
    return null;
  }
};

/**
 * Delete a file from Supabase Storage
 * @param bucket The storage bucket name
 * @param path The full path of the file to delete
 */
export const deleteFile = async (bucket: string, path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    toast.error('Error deleting file. Please try again.');
  }
};

/**
 * Get a file's path from its URL
 * @param url The public URL of the file
 * @returns The file path in the bucket
 */
export const getPathFromUrl = (url: string): string | null => {
  try {
    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};
