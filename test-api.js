// Test script to verify the get-product-by-id API endpoint
const BASE_URL = 'http://192.168.2.30:9011/api';

async function testGetProductById(id) {
  try {
    console.log(`Testing API endpoint: ${BASE_URL}/product/get-product-by-id`);
    console.log(`Request body: { "id": ${id} }`);
    
    const response = await fetch(`${BASE_URL}/product/get-product-by-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.status_code === 200 && data.data) {
      console.log('✅ API Test SUCCESS');
      console.log('Product details retrieved:');
      console.log(`- ID: ${data.data.id}`);
      console.log(`- Name: ${data.data.name}`);
      console.log(`- Type: ${data.data.productType}`);
      console.log(`- Capacity: ${data.data.capacity}`);
      return data;
    } else {
      console.log('❌ API Test FAILED');
      console.log('Error:', data.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.log('❌ API Test FAILED with exception');
    console.error('Error:', error.message);
    return null;
  }
}

// Test with ID 2 (Meeting Room) and ID 16 (Dedicated Desk)
async function runTests() {
  console.log('='.repeat(60));
  console.log('Testing get-product-by-id API endpoint');
  console.log('='.repeat(60));
  
  // Test meeting room
  console.log('\nTest 1: Getting Meeting Room (ID: 2)');
  console.log('-'.repeat(40));
  await testGetProductById(2);
  
  // Test dedicated desk
  console.log('\nTest 2: Getting Dedicated Desk (ID: 16)');
  console.log('-'.repeat(40));
  await testGetProductById(16);
  
  console.log('\n' + '='.repeat(60));
  console.log('API tests completed');
  console.log('='.repeat(60));
}

// Run the tests
runTests();
