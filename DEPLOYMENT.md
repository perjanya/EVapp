# DEPLOYMENT GUIDE

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

## Installation Steps

### 1. Clone or Download the Project
```bash
cd EVapp
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Configure Environment
```bash
# Copy example env file
copy .env.example .env

# Edit .env if needed (default settings work for development)
```

### 5. Run the Application

#### Development Mode (Recommended)
Runs both backend and frontend simultaneously:
```bash
npm run dev
```

Backend will run on: http://localhost:5000
Frontend will run on: http://localhost:3000

#### Production Mode
```bash
# Build frontend
cd client
npm run build
cd ..

# Start server
npm start
```

## Usage

### 1. Select Symbols
- Use the search box to find stocks/indices
- Click to add symbols (max 50)
- Remove symbols by clicking the × button

### 2. Configure Strategy
- **CCP (Cash Covered Put)**: Sell ITM PUT options
- **ACC (Asset Covered Call)**: Sell ITM CALL options

### 3. Select Expiry Month
- 0: Current month
- +1: Next month
- +2: Two months ahead
- +3: Three months ahead

### 4. Refresh Data
Click "Refresh Data" button to fetch real-time market data and calculate opportunities

### 5. Review Results
- Table automatically sorted by EV% (highest first)
- GREEN "YES" = Recommended trade (meets threshold)
- RED "NO" = Does not meet threshold
- Click column headers to sort by different criteria

## Data Source Configuration

### Using Mock Data (Default - Development)
The app uses simulated NSE data by default for development and testing.
No additional configuration needed.

### Using Real NSE Data (Production)
To connect to real NSE API:

1. Set environment variable:
```bash
# In .env file
USE_MOCK_DATA=false
```

2. **IMPORTANT**: NSE API requires:
   - Proper headers and cookies
   - Session management
   - Rate limiting
   - CORS handling

3. Consider using a data provider service:
   - Alpha Vantage
   - Yahoo Finance
   - Broker APIs (Zerodha Kite, Upstox, etc.)
   - Paid NSE data feeds

4. Update `server/services/nseService.js` with your chosen data provider's API

## Troubleshooting

### Port Already in Use
Change PORT in .env file:
```
PORT=5001
```

### CORS Errors
Ensure backend is running before frontend.

### API Errors with Real NSE
NSE has strict rate limiting and may block requests.
Consider:
- Adding delay between requests
- Using a proxy service
- Implementing session cookies
- Using broker API instead

## File Structure
```
EVapp/
├── server/                 # Backend
│   ├── index.js           # Express server
│   ├── routes/            # API routes
│   └── services/          # Business logic
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app
│   │   └── index.js       # Entry point
│   └── public/
├── package.json           # Root dependencies
└── README.md
```

## Production Deployment

### Option 1: Single Server (Recommended for small scale)
```bash
npm run build
npm start
```

### Option 2: Separate Deployment
- Deploy backend to Node.js hosting (Heroku, AWS, DigitalOcean)
- Deploy frontend to static hosting (Netlify, Vercel, S3)
- Update API endpoint in client

### Environment Variables for Production
```
NODE_ENV=production
PORT=5000
USE_MOCK_DATA=false
```

## Support & Customization

### Adding More Symbols
Edit `server/routes/nseRoutes.js` in the `/api/stocks` endpoint.

### Changing Thresholds
Edit `server/services/optionsLogic.js` in the `getRecommendation` function.

### Styling Customization
All styles are in `client/src/components/*.css` and `client/src/App.css`.

## Legal Disclaimer
This application is for educational purposes only.
- Not financial advice
- No guarantee of accuracy
- Use at your own risk
- Verify all data before trading
- Consult a financial advisor

## License
MIT
