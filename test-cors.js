// Simple CORS test script
const axios = require('axios');

const baseURL = 'https://etor.onrender.com';

async function testCORS() {
  console.log('🧪 Testing CORS configuration...\n');
  
  const endpoints = [
    '/api/health',
    '/api/products',
    '/api/new-season',
    '/api/category/find'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axios.get(`${baseURL}${endpoint}`, {
        headers: {
          'Origin': 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ ${endpoint}: Status ${response.status}`);
      console.log(`   CORS Headers: ${response.headers['access-control-allow-origin'] || 'Not set'}\n`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   CORS Headers: ${error.response.headers['access-control-allow-origin'] || 'Not set'}`);
      }
      console.log('');
    }
  }
}

testCORS().catch(console.error);
