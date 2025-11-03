// Simple test script to validate APIs
const axios = require('axios').default || require('axios');

const BASE_URL = 'http://localhost:3003';

async function testEndpoints() {
  console.log('🧪 Testing AI-Mi API Endpoints...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/health`,
      method: 'GET'
    },
    {
      name: 'API Documentation',
      url: `${BASE_URL}/api/v1/`,
      method: 'GET'
    },
    {
      name: 'Menu Items',
      url: `${BASE_URL}/api/v1/menu/items?limit=3`,
      method: 'GET'
    },
    {
      name: 'Menu Search',
      url: `${BASE_URL}/api/v1/menu/search?q=burger&limit=2`,
      method: 'GET'
    },
    {
      name: 'Menu Categories',
      url: `${BASE_URL}/api/v1/menu/categories`,
      method: 'GET'
    },
    {
      name: 'Create Customer',
      url: `${BASE_URL}/api/v1/customers`,
      method: 'POST',
      data: {
        name: 'Test Customer',
        tableNumber: 5,
        partySize: 2
      }
    },
    {
      name: 'Orders Health',
      url: `${BASE_URL}/api/v1/orders/health`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`⏳ Testing: ${test.name}`);
      
      const config = {
        method: test.method,
        url: test.url,
        timeout: 5000
      };
      
      if (test.data) {
        config.data = test.data;
        config.headers = { 'Content-Type': 'application/json' };
      }
      
      const response = await axios(config);
      console.log(`✅ ${test.name}: ${response.status} ${response.statusText}`);
      
      if (response.data && typeof response.data === 'object') {
        if (response.data.success !== undefined) {
          console.log(`   Success: ${response.data.success}`);
        }
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log(`   Results: ${response.data.data.length} items`);
        } else if (response.data.version) {
          console.log(`   Version: ${response.data.version}`);
        } else if (response.data.status) {
          console.log(`   Status: ${response.data.status}`);
        }
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${test.name}: Server not running (ECONNREFUSED)`);
      } else if (error.response) {
        console.log(`❌ ${test.name}: ${error.response.status} ${error.response.statusText}`);
        if (error.response.data?.error) {
          console.log(`   Error: ${error.response.data.error}`);
        }
      } else {
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }
    console.log('');
  }
}

// Check if axios is available
try {
  require('axios');
  testEndpoints().then(() => {
    console.log('🏁 API testing completed!');
    process.exit(0);
  }).catch(err => {
    console.error('Test runner error:', err.message);
    process.exit(1);
  });
} catch (e) {
  console.log('❌ axios not found. Installing axios first...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install axios', { stdio: 'inherit' });
    console.log('✅ axios installed. Rerun: node test-api.js');
  } catch (installError) {
    console.log('❌ Failed to install axios. Install manually: npm install axios');
  }
  process.exit(1);
}