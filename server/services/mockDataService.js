/**
 * Mock Data Service
 * Provides simulated NSE data for development and testing
 * Replace with actual NSE API integration in production
 */

/**
 * Generate mock spot price
 */
function generateMockSpotPrice(symbol) {
  const basePrices = {
    'NIFTY': 21500,
    'BANKNIFTY': 45000,
    'FINNIFTY': 19500,
    'RELIANCE': 2450,
    'TCS': 3650,
    'HDFCBANK': 1580,
    'INFY': 1420,
    'ICICIBANK': 980,
    'HINDUNILVR': 2380,
    'ITC': 425,
    'SBIN': 615,
    'BHARTIARTL': 895,
    'KOTAKBANK': 1755,
    'LT': 3180,
    'AXISBANK': 1025,
    'BAJFINANCE': 6850,
    'MARUTI': 10250,
    'SUNPHARMA': 1145,
    'TITAN': 3250,
    'TATAMOTORS': 725,
    'WIPRO': 445,
    'ADANIENT': 2380,
    'ONGC': 185
  };
  
  const basePrice = basePrices[symbol] || 1000;
  // Add random variation ±2%
  const variation = basePrice * (Math.random() * 0.04 - 0.02);
  return parseFloat((basePrice + variation).toFixed(2));
}

/**
 * Generate mock option chain
 */
function generateMockOptionChain(symbol, spotPrice) {
  const expiries = getNextFourMonthlyExpiries();
  const data = [];
  
  // Generate strikes around spot price
  const strikeInterval = symbol.includes('NIFTY') ? 50 : 
                        (spotPrice > 5000 ? 100 : 
                         spotPrice > 1000 ? 50 : 
                         spotPrice > 100 ? 10 : 5);
  
  const startStrike = Math.floor(spotPrice / strikeInterval) * strikeInterval - strikeInterval * 5;
  
  expiries.forEach(expiry => {
    for (let i = 0; i <= 10; i++) {
      const strike = startStrike + (i * strikeInterval);
      
      // Calculate mock option prices
      const callIV = Math.max(spotPrice - strike, 0);
      const putIV = Math.max(strike - spotPrice, 0);
      
      const callEV = Math.random() * 50 + 10;
      const putEV = Math.random() * 50 + 10;
      
      const callLTP = callIV + callEV;
      const putLTP = putIV + putEV;
      
      data.push({
        strikePrice: strike,
        expiryDate: expiry,
        CE: {
          lastPrice: parseFloat(callLTP.toFixed(2)),
          openInterest: Math.floor(Math.random() * 100000),
          change: parseFloat((Math.random() * 10 - 5).toFixed(2))
        },
        PE: {
          lastPrice: parseFloat(putLTP.toFixed(2)),
          openInterest: Math.floor(Math.random() * 100000),
          change: parseFloat((Math.random() * 10 - 5).toFixed(2))
        }
      });
    }
  });
  
  return {
    records: {
      expiryDates: expiries,
      data: data
    }
  };
}

/**
 * Get next 4 monthly expiries (last Thursday of each month)
 */
function getNextFourMonthlyExpiries() {
  const expiries = [];
  const today = new Date();
  
  for (let i = 0; i < 4; i++) {
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const lastThursday = getLastThursday(targetMonth.getFullYear(), targetMonth.getMonth());
    expiries.push(lastThursday.toISOString().split('T')[0]);
  }
  
  return expiries;
}

/**
 * Get last Thursday of a month
 */
function getLastThursday(year, month) {
  // Get last day of month
  const lastDay = new Date(year, month + 1, 0);
  const day = lastDay.getDay();
  
  // Calculate offset to last Thursday (4 = Thursday)
  const offset = (day + 3) % 7;
  const lastThursday = new Date(year, month + 1, 0 - offset);
  
  return lastThursday;
}

/**
 * Mock fetch spot price
 */
async function fetchSpotPrice(symbol) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  return generateMockSpotPrice(symbol);
}

/**
 * Mock fetch option chain
 */
async function fetchOptionChain(symbol) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
  const spotPrice = generateMockSpotPrice(symbol);
  return generateMockOptionChain(symbol, spotPrice);
}

module.exports = {
  fetchSpotPrice,
  fetchOptionChain,
  isMockMode: true
};
