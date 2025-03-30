const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const envPath = path.resolve(__dirname, '../../../.env.local');
console.log('Looking for .env.local at:', envPath);

require('dotenv').config({ path: envPath });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment variables loaded:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Found' : '✗ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to create a test file
const createTestFile = (content = 'Hello World') => {
  return Buffer.from(content);
};

// Helper function to generate a unique test file path
const generateTestFilePath = (prefix = 'test') => {
  return `test-files/${prefix}-${Date.now()}.txt`;
};

// Helper function to clean up test files
const cleanupTestFile = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('dev')
      .remove([filePath]);
    
    if (error) {
      console.error(`Failed to clean up test file: ${error.message}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Failed to clean up test file: ${err.message}`);
    return false;
  }
};

module.exports = {
  supabase,
  createTestFile,
  generateTestFilePath,
  cleanupTestFile,
}; 