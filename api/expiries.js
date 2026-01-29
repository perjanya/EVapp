// api/expiries.js
import nseService from '../server/services/nseService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { symbol } = req.query;
  if (!symbol) {
    res.status(400).json({ error: 'Symbol is required' });
    return;
  }

  try {
    const optionChainData = await nseService.fetchOptionChain(symbol);
    if (!optionChainData || !optionChainData.records) {
      res.status(404).json({ success: false, error: 'Option chain not available' });
      return;
    }
    const monthlyExpiries = nseService.getMonthlyExpiries(optionChainData.records.expiryDates);
    const expiriesWithDays = monthlyExpiries.map((expiry, index) => ({
      month: index,
      date: expiry,
      daysToExpiry: nseService.calculateDaysToExpiry(expiry)
    }));
    res.status(200).json({ success: true, symbol, expiries: expiriesWithDays });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
