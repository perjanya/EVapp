// api/screen.js
import nseService from '../server/services/nseService';
import optionsLogic from '../server/services/optionsLogic';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { symbols, strategy, expiryMonth } = req.body;
  if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
    res.status(400).json({ success: false, error: 'Symbols array is required' });
    return;
  }
  if (!['CCP', 'ACC'].includes(strategy)) {
    res.status(400).json({ success: false, error: 'Strategy must be CCP or ACC' });
    return;
  }
  if (![0, 1, 2, 3].includes(expiryMonth)) {
    res.status(400).json({ success: false, error: 'Expiry month must be 0, 1, 2, or 3' });
    return;
  }

  const results = [];
  const errors = [];

  for (const symbol of symbols) {
    try {
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
      const monthlyExpiries = nseService.getMonthlyExpiries(optionChainData.records.expiryDates);
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
        results.push(analysis);
      } else {
        errors.push({ symbol, error: 'No suitable ITM option found' });
      }
    } catch (error) {
      errors.push({ symbol, error: error.message });
    }
  }
  results.sort((a, b) => b.evPercentage - a.evPercentage);
  res.status(200).json({ success: true, results, errors: errors.length > 0 ? errors : undefined, timestamp: new Date().toISOString() });
}
