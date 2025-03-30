import { supabase } from './supabase';

/**
 * Verifies access to the Supabase dev bucket and images folder
 */
export async function ensureStorageBucketExists() {
  try {
    console.log('Starting bucket verification process...');
    
    // Check if we can access the dev bucket
    console.log('Attempting to list files in dev bucket...');
    const { data: files, error: listError } = await supabase.storage
      .from('dev')
      .list();
      
    if (listError) {
      console.error('Error accessing dev bucket:', {
        message: listError.message
      });
      throw listError;
    }
    
    console.log('Successfully accessed dev bucket, found files:', files?.length || 0);
    
    // Check if we can list files in the images folder
    console.log('Attempting to list files in images folder...');
    const { data: imageFiles, error: listImagesError } = await supabase.storage
      .from('dev')
      .list('images');
      
    if (listImagesError) {
      console.error('Error accessing images folder:', {
        message: listImagesError.message
      });
      throw listImagesError;
    }
    
    console.log('Successfully accessed images folder, found files:', imageFiles?.length || 0);
    console.log('Bucket verification completed successfully');
  } catch (error) {
    console.error('Error in bucket verification:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    });
    throw error;
  }
} 