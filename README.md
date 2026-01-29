# 📊 Options Screening Application

> Production-ready stock and options screening web application for identifying high Extrinsic Value (EV) opportunities in NSE equity and derivatives markets.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

---

## 🎯 Overview

A professional-grade fintech application that screens up to 50 stocks/indices simultaneously to identify the best **Cash Covered Put (CCP)** and **Asset Covered Call (ACC)** opportunities based on Extrinsic Value percentage.

### Key Capabilities
✅ Real-time spot price and option chain data fetching  
✅ Support for CCP (ITM PUT) and ACC (ITM CALL) strategies  
✅ Monthly expiries support (current, +1, +2, +3 months)  
✅ Automatic IV, EV, and EV% calculations  
✅ Smart recommendations (Index: >1%, Stocks: >2%)  
✅ Sortable results table (highest EV% first)  
✅ Clean, minimal, fast UI  
✅ Mock data mode for development  

---

## 🚀 Quick Start

### Windows (Recommended)
Double-click **`start.bat`** in the project folder

### Manual Installation

#### 1. Install Dependencies
```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

#### 2. Run Application
```bash
# Development mode (both servers)
npm run dev
```

**Access:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [USER_GUIDE.md](USER_GUIDE.md) | Complete user manual with step-by-step instructions |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Installation, configuration, and deployment guide |
| [API_DOCS.md](API_DOCS.md) | API endpoints, parameters, and examples |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture and system design |

---

## 💡 Features

### Strategy Support

#### 🛡️ Cash Covered Put (CCP)
- Selects **nearest ITM PUT** option
- Identifies opportunities to acquire stocks at discount
- Recommends trades with **EV% > 2%** (stocks) or **EV% > 1%** (indices)

#### 📈 Asset Covered Call (ACC)
- Selects **nearest ITM CALL** option
- Generates income on existing holdings
- Same recommendation thresholds as CCP

### Financial Calculations

**Intrinsic Value (IV):**
```
CALL: IV = max(Spot Price - Strike Price, 0)
PUT:  IV = max(Strike Price - Spot Price, 0)
```

**Extrinsic Value (EV):**
```
EV = Option LTP - IV
```

**EV Percentage:**
```
EV% = (EV / Strike Price) × 100
```

### User Interface

- **Symbol Selector:** Search and add up to 50 symbols
- **Strategy Toggle:** Switch between CCP and ACC
- **Expiry Selector:** Choose monthly expiry (0 to +3 months)
- **Refresh Button:** Manual data update
- **Results Table:** Sortable, color-coded recommendations

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18.2
- **HTTP Client:** Axios
- **Styling:** Modular CSS
- **State:** React Hooks

### Backend
- **Runtime:** Node.js (v16+)
- **Framework:** Express 4.18
- **Caching:** node-cache (30s TTL)
- **CORS:** Enabled for development

### Data Source
- **NSE (National Stock Exchange of India)**
- **Mock data mode** available for development/testing

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | Get available stocks/indices |
| POST | `/api/screen` | Screen symbols for opportunities |
| GET | `/api/expiries/:symbol` | Get monthly expiries for symbol |
| GET | `/health` | Server health check |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/screen \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["NIFTY", "RELIANCE"],
    "strategy": "CCP",
    "expiryMonth": 0
  }'
```

See [API_DOCS.md](API_DOCS.md) for complete details.

---

## 📁 Project Structure

```
EVapp/
├── server/                    # Backend (Node.js + Express)
│   ├── index.js              # Main server file
│   ├── routes/
│   │   └── nseRoutes.js      # API route handlers
│   └── services/
│       ├── nseService.js     # NSE data fetching
│       ├── optionsLogic.js   # IV/EV calculations
│       └── mockDataService.js # Development mock data
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── App.js            # Main app component
│   │   ├── components/       # React components
│   │   │   ├── SymbolSelector.js
│   │   │   ├── ControlPanel.js
│   │   │   ├── ResultsTable.js
│   │   │   └── LoadingSpinner.js
│   │   └── *.css             # Component styles
│   ├── public/
│   └── package.json
├── package.json              # Root dependencies
├── start.bat                 # Quick start script (Windows)
├── .env.example              # Environment configuration
└── README.md                 # This file
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# Server port
PORT=5000

# Data source (true = mock data, false = real NSE)
USE_MOCK_DATA=true

# Cache duration (seconds)
CACHE_TTL=30
```

### Switching to Real NSE Data

1. Set `USE_MOCK_DATA=false` in `.env`
2. Configure NSE API credentials (see DEPLOYMENT.md)
3. **Note:** NSE has strict rate limiting and CORS policies
4. Consider using broker APIs (Zerodha Kite, Upstox) instead

---

## 🎨 Screenshots

### Main Dashboard
- Symbol selector with search
- Strategy toggle (CCP/ACC)
- Expiry month dropdown
- Refresh button with timestamp

### Results Table
- Sortable columns
- Color-coded recommendations (GREEN = YES, RED = NO)
- Highlighted EV and EV% columns
- Spot price display per symbol

---

## 📈 Strategy Rules

| Asset Type | Minimum EV% | Example |
|------------|-------------|---------|
| **Index** (NIFTY, BANKNIFTY, etc.) | > 1.0% | EV% = 1.2% → ✅ YES |
| **Stock** (RELIANCE, TCS, etc.) | > 2.0% | EV% = 2.3% → ✅ YES |

Results automatically sorted by **EV% descending** (highest opportunities first).

---

## 🧪 Development

### Scripts

```bash
# Run both frontend and backend
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Build production frontend
npm run build

# Start production server
npm start
```

### Adding New Stocks

Edit [`server/routes/nseRoutes.js`](server/routes/nseRoutes.js):
```javascript
const stocks = [
  { symbol: 'NEWSYMBOL', name: 'New Company', type: 'STOCK' },
  // ...
];
```

### Customizing Thresholds

Edit [`server/services/optionsLogic.js`](server/services/optionsLogic.js):
```javascript
function getRecommendation(evPercentage, symbol) {
  const threshold = isIndex(symbol) ? 1.0 : 2.0; // Modify here
  return evPercentage > threshold ? 'YES' : 'NO';
}
```

---

## 🔒 Security & Disclaimer

### ⚠️ IMPORTANT DISCLAIMERS

1. **Educational Purpose Only:** This application is for learning and research
2. **Not Financial Advice:** Do not use as sole basis for trading decisions
3. **No Guarantees:** Market data accuracy not guaranteed
4. **Risk Warning:** Options trading involves substantial risk
5. **Verify Data:** Always cross-check with official sources before trading
6. **Professional Advice:** Consult licensed financial advisors

### Security Considerations

- No authentication (add for production)
- No data encryption (use HTTPS in production)
- No rate limiting (implement for production)
- No audit logging (add for compliance)

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production (Single Server)
```bash
cd client
npm run build
cd ..
npm start
```

### Production (Separate Hosting)
- **Backend:** Deploy to Heroku, AWS, DigitalOcean
- **Frontend:** Deploy to Netlify, Vercel, S3
- Update API endpoint in frontend

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🤝 Contributing

This is an educational project. Contributions welcome:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

Copyright © 2026 Options Screening App

---

## 🆘 Support

### Need Help?

1. **Installation Issues:** See [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Usage Questions:** See [USER_GUIDE.md](USER_GUIDE.md)
3. **API Questions:** See [API_DOCS.md](API_DOCS.md)
4. **Technical Details:** See [ARCHITECTURE.md](ARCHITECTURE.md)

### Troubleshooting

**App won't start:**
```bash
# Kill existing Node processes
taskkill /F /IM node.exe

# Reinstall dependencies
npm install
cd client && npm install

# Try again
npm run dev
```

**Port conflicts:**
```bash
# Change port in .env
PORT=5001
```

---

## 🎓 Learning Resources

- [NSE India](https://www.nseindia.com/) - Official exchange website
- [Options Basics](https://www.investopedia.com/options-basics-tutorial-4583012) - Understanding options
- [Covered Call Strategy](https://www.investopedia.com/terms/c/coveredcall.asp)
- [Cash-Secured Put](https://www.investopedia.com/terms/c/cashsecuredput.asp)

---

## 🌟 Features Roadmap

### Version 2.0 (Planned)
- [ ] Historical EV% tracking
- [ ] Backtesting engine
- [ ] Greeks calculation (Delta, Theta, Vega, Gamma)
- [ ] Implied Volatility analysis
- [ ] Portfolio tracking
- [ ] Alert notifications (email/SMS)
- [ ] Mobile app (React Native)
- [ ] Real-time WebSocket updates

### Integration Possibilities
- [ ] Zerodha Kite Connect API
- [ ] Upstox API
- [ ] 5Paisa API
- [ ] Interactive Brokers API
- [ ] Automated order placement

---

**Built with ❤️ for the trading community**

---

*Last Updated: January 29, 2026*
