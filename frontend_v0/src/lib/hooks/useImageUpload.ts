import { useState } from "react"
import { supabase } from "../supabase"
import { v4 as uuidv4 } from "uuid"

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    console.log('handleFile called with file:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    setFile(file)
    setError(null)

    const reader = new FileReader()
    reader.onload = () => {
      console.log('FileReader completed, setting preview');
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Convert file to data URL for fallback mechanism
  const fileToDataUrl = async (file: File): Promise<string> => {
    console.log('Converting file to data URL');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Data URL conversion completed');
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  const uploadToSupabase = async (): Promise<string | null> => {
    if (!file) {
      console.log('No file to upload');
      return null;
    }
    
    console.log('Starting upload process with file:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    setIsUploading(true)
    setError(null)
    
    try {
      console.log('Attempting Supabase upload...');

      // First try to use Supabase storage
      try {
        // Create a unique file path using uuid
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `images/${fileName}`
        
        console.log('Preparing upload with:', {
          fileExt,
          fileName,
          filePath
        });
        
        // Upload file to Supabase Storage using the 'dev' bucket
        console.log('Initiating upload to Supabase...');
        const { data, error: uploadError } = await supabase.storage
          .from('dev')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type // Add content type
          })
        
        if (uploadError) {
          console.error('Supabase upload error:', {
            message: uploadError.message
          });
          throw uploadError;
        }
        
        console.log('Supabase upload successful:', data);
        
        // Get public URL instead of signed URL for public bucket
        console.log('Getting public URL for uploaded file...');
        const { data: publicUrlData } = supabase.storage
          .from('dev')
          .getPublicUrl(filePath);
        
        if (!publicUrlData?.publicUrl) {
          console.error('Failed to get public URL');
          throw new Error('Failed to get public URL for uploaded file');
        }
        
        console.log('Generated public URL:', publicUrlData.publicUrl);
        setSignedUrl(publicUrlData.publicUrl);
        return publicUrlData.publicUrl;
      } catch (supabaseErr) {
        console.warn('Supabase upload failed, details:', {
          message: supabaseErr instanceof Error ? supabaseErr.message : 'Unknown error'
        });
        console.log('Falling back to data URL...');
        // Simply continue to the data URL fallback below
      }
      
      // Fallback to data URL if Supabase upload fails
      console.log('Using data URL fallback for image upload');
      const dataUrl = await fileToDataUrl(file);
      setSignedUrl(dataUrl);
      return dataUrl;
      
    } catch (err) {
      console.error('Upload exception:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      
      // Final fallback to data URL if everything else fails
      try {
        console.log('Using emergency fallback to data URL');
        return await fileToDataUrl(file);
      } catch (readErr) {
        console.error('Even data URL fallback failed:', readErr);
        return null;
      }
    } finally {
      console.log('Upload process completed');
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    console.log('Clearing image state');
    setPreview(null)
    setFile(null)
    setSignedUrl(null)
    setError(null)
  }

  return {
    file,
    preview,
    signedUrl,
    isUploading,
    error,
    handleFile,
    uploadToSupabase,
    clearImage
  }
} 