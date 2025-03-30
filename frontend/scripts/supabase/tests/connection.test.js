const { supabase } = require('./utils');

async function testConnection() {
  console.log('\n=== Testing Supabase Connection ===\n');

  // Test 1: Basic connection test
  console.log('Test 1: Testing basic connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    console.log('✅ Basic connection successful');
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    return false;
  }

  // Test 2: Storage bucket access
  console.log('\nTest 2: Testing storage bucket access...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('❌ Storage access failed:', error.message);
      return false;
    }
    console.log('✅ Storage access successful');
    console.log('Available buckets:', data.map(bucket => bucket.name));
  } catch (err) {
    console.log('❌ Storage access failed:', err.message);
    return false;
  }

  return true;
}

module.exports = { testConnection }; 