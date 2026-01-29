/**
 * Options Pricing Logic
 * Contains all financial calculations for IV, EV, and recommendations
 */

/**
 * Calculate Intrinsic Value for CALL option
 * IV = max(Spot Price - Strike Price, 0)
 * @param {number} spotPrice - Current spot price
 * @param {number} strikePrice - Strike price of option
 * @returns {number} - Intrinsic value (never negative)
 */
function calculateCallIV(spotPrice, strikePrice) {
  return Math.max(spotPrice - strikePrice, 0);
}

/**
 * Calculate Intrinsic Value for PUT option
 * IV = max(Strike Price - Spot Price, 0)
 * @param {number} spotPrice - Current spot price
 * @param {number} strikePrice - Strike price of option
 * @returns {number} - Intrinsic value (never negative)
 */
function calculatePutIV(spotPrice, strikePrice) {
  return Math.max(strikePrice - spotPrice, 0);
}

/**
 * Calculate Extrinsic Value
 * EV = Option LTP - IV
 * @param {number} optionLTP - Last traded price of option
 * @param {number} intrinsicValue - Calculated IV
 * @returns {number} - Extrinsic value
 */
function calculateEV(optionLTP, intrinsicValue) {
  return optionLTP - intrinsicValue;
}

/**
 * Calculate Extrinsic Value Percentage
 * EV % = (EV / Strike Price) * 100
 * @param {number} extrinsicValue - Calculated EV
 * @param {number} strikePrice - Strike price
 * @returns {number} - EV percentage
 */
function calculateEVPercentage(extrinsicValue, strikePrice) {
  if (strikePrice === 0) return 0;
  return (extrinsicValue / strikePrice) * 100;
}

/**
 * Find nearest ITM CALL option
 * @param {Array} optionChain - Array of option data
 * @param {number} spotPrice - Current spot price
 * @param {string} expiryDate - Target expiry date
 * @returns {Object|null} - Selected CALL option or null
 */
function findNearestITMCall(optionChain, spotPrice, expiryDate) {
  if (!optionChain || optionChain.length === 0) return null;
  
  // Filter for target expiry and CALLs with LTP
  const calls = optionChain
    .filter(opt => opt.expiryDate === expiryDate && opt.CE && opt.CE.lastPrice > 0)
    .map(opt => ({
      strikePrice: opt.strikePrice,
      ltp: opt.CE.lastPrice,
      ...opt.CE
    }));
  
  // ITM calls have strike < spot
  const itmCalls = calls.filter(call => call.strikePrice < spotPrice);
  
  if (itmCalls.length === 0) return null;
  
  // Find nearest ITM (highest strike below spot)
  const nearest = itmCalls.reduce((prev, curr) => 
    curr.strikePrice > prev.strikePrice ? curr : prev
  );
  
  return nearest;
}

/**
 * Find nearest ITM PUT option
 * @param {Array} optionChain - Array of option data
 * @param {number} spotPrice - Current spot price
 * @param {string} expiryDate - Target expiry date
 * @returns {Object|null} - Selected PUT option or null
 */
function findNearestITMPut(optionChain, spotPrice, expiryDate) {
  if (!optionChain || optionChain.length === 0) return null;
  
  // Filter for target expiry and PUTs with LTP
  const puts = optionChain
    .filter(opt => opt.expiryDate === expiryDate && opt.PE && opt.PE.lastPrice > 0)
    .map(opt => ({
      strikePrice: opt.strikePrice,
      ltp: opt.PE.lastPrice,
      ...opt.PE
    }));
  
  // ITM puts have strike > spot
  const itmPuts = puts.filter(put => put.strikePrice > spotPrice);
  
  if (itmPuts.length === 0) return null;
  
  // Find nearest ITM (lowest strike above spot)
  const nearest = itmPuts.reduce((prev, curr) => 
    curr.strikePrice < prev.strikePrice ? curr : prev
  );
  
  return nearest;
}

/**
 * Check if symbol is an index
 * @param {string} symbol - Stock/Index symbol
 * @returns {boolean} - True if index
 */
function isIndex(symbol) {
  const indices = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'];
  return indices.includes(symbol.toUpperCase());
}

/**
 * Get recommendation based on strategy rules
 * Index: EV% > 1%
 * Stock: EV% > 2%
 * @param {number} evPercentage - Calculated EV%
 * @param {string} symbol - Stock/Index symbol
 * @returns {string} - 'YES' or 'NO'
 */
function getRecommendation(evPercentage, symbol) {
  const threshold = isIndex(symbol) ? 1.0 : 2.0;
  return evPercentage > threshold ? 'YES' : 'NO';
}

/**
 * Process complete option analysis for a symbol
 * @param {string} symbol - Stock/Index symbol
 * @param {number} spotPrice - Current spot price
 * @param {Array} optionChain - Option chain data
 * @param {string} expiryDate - Target expiry date
 * @param {string} strategy - 'CCP' or 'ACC'
 * @param {number} daysToExpiry - Days remaining to expiry
 * @returns {Object} - Complete analysis result
 */
function analyzeOption(symbol, spotPrice, optionChain, expiryDate, strategy, daysToExpiry) {
  let option, optionType, intrinsicValue;
  
  if (strategy === 'CCP') {
    // Cash Covered Put - use ITM PUT
    option = findNearestITMPut(optionChain, spotPrice, expiryDate);
    optionType = 'PUT';
    if (option) {
      intrinsicValue = calculatePutIV(spotPrice, option.strikePrice);
    }
  } else {
    // Asset Covered Call - use ITM CALL
    option = findNearestITMCall(optionChain, spotPrice, expiryDate);
    optionType = 'CALL';
    if (option) {
      intrinsicValue = calculateCallIV(spotPrice, option.strikePrice);
    }
  }
  
  if (!option) {
    return null;
  }
  
  const extrinsicValue = calculateEV(option.ltp, intrinsicValue);
  const evPercentage = calculateEVPercentage(extrinsicValue, option.strikePrice);
  const recommendation = getRecommendation(evPercentage, symbol);
  
  return {
    symbol,
    optionType,
    strikePrice: option.strikePrice,
    optionLTP: option.ltp,
    intrinsicValue: parseFloat(intrinsicValue.toFixed(2)),
    extrinsicValue: parseFloat(extrinsicValue.toFixed(2)),
    evPercentage: parseFloat(evPercentage.toFixed(2)),
    daysToExpiry,
    recommendation,
    spotPrice: parseFloat(spotPrice.toFixed(2))
  };
}

module.exports = {
  calculateCallIV,
  calculatePutIV,
  calculateEV,
  calculateEVPercentage,
  findNearestITMCall,
  findNearestITMPut,
  getRecommendation,
  analyzeOption,
  isIndex
};
