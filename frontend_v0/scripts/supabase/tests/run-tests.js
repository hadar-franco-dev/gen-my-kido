const { testConnection } = require('./connection.test');
const { testStorage } = require('./storage.test');

async function runTests() {
  console.log('Starting Supabase Integration Tests...\n');

  let allTestsPassed = true;

  // Run connection tests
  const connectionTestPassed = await testConnection();
  if (!connectionTestPassed) {
    console.error('\n❌ Connection tests failed');
    allTestsPassed = false;
  } else {
    console.log('\n✅ Connection tests passed');
  }

  // Run storage tests
  const storageTestPassed = await testStorage();
  if (!storageTestPassed) {
    console.error('\n❌ Storage tests failed');
    allTestsPassed = false;
  } else {
    console.log('\n✅ Storage tests passed');
  }

  // Final summary
  console.log('\n=== Test Summary ===');
  if (allTestsPassed) {
    console.log('✅ All tests passed successfully!');
  } else {
    console.log('❌ Some tests failed. Please check the logs above for details.');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('\n❌ Test runner failed with unexpected error:', error);
  process.exit(1);
}); 