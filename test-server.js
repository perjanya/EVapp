// Simple test script to verify server functionality
const axios = require('axios');

async function testServer() {
  const baseURL = 'http://localhost:5000';
  
  console.log('\n🧪 Testing Options Screening App Backend...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: Get Stocks List
    console.log('\n2️⃣  Testing stocks list endpoint...');
    const stocksResponse = await axios.get(`${baseURL}/api/stocks`);
    console.log(`✅ Stocks loaded: ${stocksResponse.data.stocks.length} symbols`);
    console.log('   Sample stocks:', stocksResponse.data.stocks.slice(0, 3).map(s => s.symbol).join(', '));
    
    // Test 3: Screen symbols (CCP strategy)
    console.log('\n3️⃣  Testing screening endpoint (CCP strategy)...');
    const screenRequest = {
      symbols: ['NIFTY', 'RELIANCE', 'TCS'],
      strategy: 'CCP',
      expiryMonth: 0
    };
    
    const screenResponse = await axios.post(`${baseURL}/api/screen`, screenRequest);
    console.log(`✅ Screening completed: ${screenResponse.data.results.length} results`);
    
    if (screenResponse.data.results.length > 0) {
      const firstResult = screenResponse.data.results[0];
      console.log('\n📊 Sample Result:');
      console.log(`   Symbol: ${firstResult.symbol}`);
      console.log(`   Option Type: ${firstResult.optionType}`);
      console.log(`   Strike Price: ₹${firstResult.strikePrice}`);
      console.log(`   Option LTP: ₹${firstResult.optionLTP}`);
      console.log(`   Intrinsic Value: ₹${firstResult.intrinsicValue}`);
      console.log(`   Extrinsic Value: ₹${firstResult.extrinsicValue}`);
      console.log(`   EV%: ${firstResult.evPercentage}%`);
      console.log(`   Days to Expiry: ${firstResult.daysToExpiry}`);
      console.log(`   Recommendation: ${firstResult.recommendation}`);
    }
    
    // Test 4: Screen with ACC strategy
    console.log('\n4️⃣  Testing screening endpoint (ACC strategy)...');
    const accRequest = {
      symbols: ['BANKNIFTY', 'INFY'],
      strategy: 'ACC',
      expiryMonth: 1
    };
    
    const accResponse = await axios.post(`${baseURL}/api/screen`, accRequest);
    console.log(`✅ ACC screening completed: ${accResponse.data.results.length} results`);
    
    console.log('\n✨ All tests passed! Backend is working correctly.\n');
    console.log('📝 Summary:');
    console.log('   - Health check: ✅');
    console.log('   - Stocks list: ✅');
    console.log('   - CCP screening: ✅');
    console.log('   - ACC screening: ✅');
    console.log('\n🎉 Application is ready for use!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests
testServer();
