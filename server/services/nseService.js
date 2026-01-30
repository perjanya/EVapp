import axios from 'axios';
import mockDataService from './mockDataService.js';

/**
 * NSE Data Service
 * Handles all NSE data fetching operations
 * Set USE_MOCK_DATA to false to use real NSE API
 */

const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== 'false'; // Default to mock data

// Headers to mimic browser request for NSE
const NSE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive'
};

const NSE_BASE_URL = 'https://www.nseindia.com';

/**
 * Fetch spot price for a stock or index
 * @param {string} symbol - Stock symbol (e.g., 'RELIANCE', 'NIFTY')
 * @returns {Promise<number>} - Spot price
 */
async function fetchSpotPrice(symbol) {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log(`[MOCK] Fetching spot price for ${symbol}`);
    return await mockDataService.fetchSpotPrice(symbol);
  }
  
  try {
    // For indices like NIFTY, BANKNIFTY
    if (symbol === 'NIFTY' || symbol === 'BANKNIFTY' || symbol === 'FINNIFTY') {
      const url = `${NSE_BASE_URL}/api/allIndices`;
      const response = await axios.get(url, { headers: NSE_HEADERS });
      const indexData = response.data.data.find(idx => idx.index === symbol);
      return indexData ? parseFloat(indexData.last) : null;
    }
    
    // For stocks
    const url = `${NSE_BASE_URL}/api/quote-equity?symbol=${symbol}`;
    const response = await axios.get(url, { headers: NSE_HEADERS });
    return parseFloat(response.data.priceInfo.lastPrice);
  } catch (error) {
    console.error(`Error fetching spot price for ${symbol}:`, error.message);
    throw new Error(`Failed to fetch spot price for ${symbol}`);
  }
}

/**
 * Fetch option chain data for a symbol
 * @param {string} symbol - Stock/Index symbol
 * @returns {Promise<Object>} - Option chain data
 */
async function fetchOptionChain(symbol) {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log(`[MOCK] Fetching option chain for ${symbol}`);
    return await mockDataService.fetchOptionChain(symbol);
  }
  
  try {
    let url;
    
    // Different endpoints for indices vs stocks
    if (symbol === 'NIFTY' || symbol === 'BANKNIFTY' || symbol === 'FINNIFTY') {
      url = `${NSE_BASE_URL}/api/option-chain-indices?symbol=${symbol}`;
    } else {
      url = `${NSE_BASE_URL}/api/option-chain-equities?symbol=${symbol}`;
    }
    
    const response = await axios.get(url, { headers: NSE_HEADERS });
    return response.data;
  } catch (error) {
    console.error(`Error fetching option chain for ${symbol}:`, error.message);
    throw new Error(`Failed to fetch option chain for ${symbol}`);
  }
}

/**
 * Get monthly expiry dates
 * @param {Array} expiryDates - All expiry dates from option chain
 * @returns {Array} - Filtered monthly expiries (0, +1, +2, +3)
 */
function getMonthlyExpiries(expiryDates) {
  if (!expiryDates || expiryDates.length === 0) return [];
  
  // Get unique expiry dates
  const uniqueDates = [...new Set(expiryDates)].sort();
  
  // Group by month and take last Thursday of each month
  const monthlyExpiries = [];
  const seenMonths = new Set();
  
  uniqueDates.forEach(dateStr => {
    const date = new Date(dateStr);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!seenMonths.has(monthKey)) {
      seenMonths.add(monthKey);
      monthlyExpiries.push(dateStr);
    }
  });
  
  // Return first 4 monthly expiries
  return monthlyExpiries.slice(0, 4);
}

/**
 * Calculate days to expiry
 * @param {string} expiryDate - Expiry date string
 * @returns {number} - Days remaining
 */
function calculateDaysToExpiry(expiryDate) {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export default {
  fetchSpotPrice,
  fetchOptionChain,
  getMonthlyExpiries,
  calculateDaysToExpiry
};
