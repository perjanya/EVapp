// api/stocks.js

export default function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const stocks = [
    { symbol: 'NIFTY', name: 'NIFTY 50', type: 'INDEX' },
    { symbol: 'BANKNIFTY', name: 'BANK NIFTY', type: 'INDEX' },
    { symbol: 'FINNIFTY', name: 'FIN NIFTY', type: 'INDEX' },
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

  res.status(200).json({ success: true, stocks });
}
