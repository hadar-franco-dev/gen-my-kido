const {
  supabase,
  createTestFile,
  generateTestFilePath,
  cleanupTestFile,
} = require('./utils');

async function testStorage() {
  console.log('\n=== Testing Supabase Storage ===\n');
  let testFilePath = null;

  try {
    // Test 1: Unauthenticated upload (should fail)
    console.log('Test 1: Attempting upload as unauthenticated user...');
    testFilePath = `test-files/unauth-${Date.now()}.txt`;
    const { error: uploadError } = await supabase.storage
      .from('dev')
      .upload(testFilePath, createTestFile());
    
    if (uploadError) {
      console.log('✅ Success: Unauthenticated upload was blocked');
      console.log('Error message:', uploadError.message);
    } else {
      console.log('❌ Failed: Unauthenticated upload was allowed');
      return false;
    }

    // Test 2: Unauthenticated download via public URL (should fail)
    console.log('\nTest 2: Testing public URL access...');
    const { data: publicUrlData } = supabase.storage
      .from('dev')
      .getPublicUrl(testFilePath);

    // Try to fetch the URL to verify it's actually blocked
    if (publicUrlData?.publicUrl) {
      try {
        const response = await fetch(publicUrlData.publicUrl);
        if (response.ok) {
          console.log('❌ Failed: Public URL access was allowed');
          return false;
        } else {
          console.log('✅ Success: Public URL access was blocked');
        }
      } catch (err) {
        console.log('✅ Success: Public URL access was blocked');
      }
    } else {
      console.log('✅ Success: Public URL generation was blocked');
    }

    // Test 3: Unauthenticated signed URL access (should fail)
    console.log('\nTest 3: Testing signed URL access...');
    const { error: signedUrlError } = await supabase.storage
      .from('dev')
      .createSignedUrl(testFilePath, 60);
    
    if (signedUrlError) {
      console.log('✅ Success: Signed URL generation was blocked for unauthenticated user');
      console.log('Error:', signedUrlError.message);
    } else {
      console.log('❌ Failed: Signed URL generation was allowed for unauthenticated user');
      return false;
    }

    // Cleanup
    console.log('\nCleaning up test files...');
    const cleanupSuccess = await cleanupTestFile(testFilePath);
    if (!cleanupSuccess) {
      console.log('⚠️ Warning: Failed to clean up test file');
    } else {
      console.log('✅ Success: Test file cleaned up');
    }

    return true;
  } catch (err) {
    console.error('❌ Test failed with unexpected error:', err.message);
    // Attempt cleanup in case of error
    if (testFilePath) {
      await cleanupTestFile(testFilePath);
    }
    return false;
  }
}

// Export the test function
module.exports = { testStorage }; 