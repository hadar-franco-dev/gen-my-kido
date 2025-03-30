'use client';

import { useEffect } from 'react';
import { ensureStorageBucketExists } from '@/lib/supabase-bucket-setup';

export function SupabaseInit() {
  useEffect(() => {
    // Initialize Supabase storage bucket
    ensureStorageBucketExists().catch(console.error);
  }, []);

  // This component doesn't render anything
  return null;
} 