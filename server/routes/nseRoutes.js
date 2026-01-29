const express = require('express');
const router = express.Router();
const nseService = require('../services/nseService');
const optionsLogic = require('../services/optionsLogic');

/**
 * GET /api/stocks
 * Returns list of popular NSE stocks and indices
 */
router.get('/stocks', (req, res) => {
  const stocks = [
    // Indices
    { symbol: 'NIFTY', name: 'NIFTY 50', type: 'INDEX' },
    { symbol: 'BANKNIFTY', name: 'BANK NIFTY', type: 'INDEX' },
    { symbol: 'FINNIFTY', name: 'FIN NIFTY', type: 'INDEX' },
    
    // Top stocks
    { symbol: 'RELIANCE', name: 'Reliance Industries', type: 'STOCK' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'STOCK' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', type: 'STOCK' },
    { symbol: 'INFY', name: 'Infosys', type: 'STOCK' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', type: 'STOCK' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', type: 'STOCK' },
    { symbol: 'ITC', name: 'ITC Ltd', type: 'STOCK' },
    { symbol: 'SBIN', name: 'State Bank of India', type: 'STOCK' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', type: 'STOCK' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', type: 'STOCK' },
    { symbol: 'LT', name: 'Larsen & Toubro', type: 'STOCK' },
    { symbol: 'AXISBANK', name: 'Axis Bank', type: 'STOCK' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', type: 'STOCK' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', type: 'STOCK' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharma', type: 'STOCK' },
    { symbol: 'TITAN', name: 'Titan Company', type: 'STOCK' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', type: 'STOCK' },
    { symbol: 'WIPRO', name: 'Wipro', type: 'STOCK' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises', type: 'STOCK' },
    { symbol: 'ONGC', name: 'ONGC', type: 'STOCK' },
  ];
  
  res.json({ success: true, stocks });
});

/**
 * POST /api/screen
 * Screen stocks based on strategy and expiry
 * Body: { symbols: [], strategy: 'CCP'|'ACC', expiryMonth: 0|1|2|3 }
 */
router.post('/screen', async (req, res) => {
  try {
    const { symbols, strategy, expiryMonth } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Symbols array is required' 
      });
    }
    
    if (!['CCP', 'ACC'].includes(strategy)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Strategy must be CCP or ACC' 
      });
    }
    
    if (![0, 1, 2, 3].includes(expiryMonth)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Expiry month must be 0, 1, 2, or 3' 
      });
    }
    
    const results = [];
    const errors = [];
    
    // Process each symbol
    for (const symbol of symbols) {
      try {
        // Check cache first
        const cacheKey = `${symbol}-${strategy}-${expiryMonth}`;
        const cached = req.cache.get(cacheKey);
        
        if (cached) {
          results.push(cached);
          continue;
        }
        
        // Fetch spot price
        const spotPrice = await nseService.fetchSpotPrice(symbol);
        
        if (!spotPrice) {
          errors.push({ symbol, error: 'Spot price not available' });
          continue;
        }
        
        // Fetch option chain
        const optionChainData = await nseService.fetchOptionChain(symbol);
        
        if (!optionChainData || !optionChainData.records) {
          errors.push({ symbol, error: 'Option chain not available' });
          continue;
        }
        
        // Get monthly expiries
        const monthlyExpiries = nseService.getMonthlyExpiries(
          optionChainData.records.expiryDates
        );
        
        if (!monthlyExpiries[expiryMonth]) {
          errors.push({ symbol, error: `Expiry month ${expiryMonth} not available` });
          continue;
        }
        
        const targetExpiry = monthlyExpiries[expiryMonth];
        const daysToExpiry = nseService.calculateDaysToExpiry(targetExpiry);
        
        // Analyze option
        const analysis = optionsLogic.analyzeOption(
          symbol,
          spotPrice,
          optionChainData.records.data,
          targetExpiry,
          strategy,
          daysToExpiry
        );
        
        if (analysis) {
          // Cache the result
          req.cache.set(cacheKey, analysis);
          results.push(analysis);
        } else {
          errors.push({ symbol, error: 'No suitable ITM option found' });
        }
        
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error.message);
        errors.push({ symbol, error: error.message });
      }
    }
    
    // Sort results by EV% descending (highest first)
    results.sort((a, b) => b.evPercentage - a.evPercentage);
    
    res.json({ 
      success: true, 
      results,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Screen error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/expiries/:symbol
 * Get available monthly expiries for a symbol
 */
router.get('/expiries/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const optionChainData = await nseService.fetchOptionChain(symbol);
    
    if (!optionChainData || !optionChainData.records) {
      return res.status(404).json({ 
        success: false, 
        error: 'Option chain not available' 
      });
    }
    
    const monthlyExpiries = nseService.getMonthlyExpiries(
      optionChainData.records.expiryDates
    );
    
    const expiriesWithDays = monthlyExpiries.map((expiry, index) => ({
      month: index,
      date: expiry,
      daysToExpiry: nseService.calculateDaysToExpiry(expiry)
    }));
    
    res.json({ 
      success: true, 
      symbol,
      expiries: expiriesWithDays 
    });
    
  } catch (error) {
    console.error('Expiries error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
