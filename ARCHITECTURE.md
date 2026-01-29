# TECHNICAL ARCHITECTURE

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                    (React Frontend - Port 3000)              │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP/REST API
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Express Backend (Port 5000)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    API Routes Layer                     │ │
│  │  - /api/stocks (GET)                                   │ │
│  │  - /api/screen (POST)                                  │ │
│  │  - /api/expiries/:symbol (GET)                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                               │                              │
│  ┌────────────────────────────▼──────────────────────────┐  │
│  │              Business Logic Layer                      │  │
│  │  - optionsLogic.js (IV/EV calculations)               │  │
│  │  - Recommendation engine                               │  │
│  │  - ITM option selection                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                               │                              │
│  ┌────────────────────────────▼──────────────────────────┐  │
│  │               Data Service Layer                       │  │
│  │  - nseService.js (NSE API wrapper)                    │  │
│  │  - mockDataService.js (Development)                    │  │
│  │  - 30s cache (NodeCache)                               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    NSE Market Data                           │
│  - Spot Prices (Indices & Stocks)                           │
│  - Option Chain (Calls & Puts)                              │
│  - Monthly Expiries                                          │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** React 18
- **HTTP Client:** Axios
- **Styling:** Vanilla CSS (modular)
- **State Management:** React useState/useEffect hooks
- **Build Tool:** Create React App

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Caching:** node-cache
- **HTTP Client:** Axios
- **CORS:** cors middleware

### Development Tools
- **Concurrency:** concurrently (run both servers)
- **Hot Reload:** React Scripts, Nodemon

## Data Flow

### 1. User Interaction Flow
```
User selects symbols → User configures strategy → Clicks refresh
  → Frontend sends POST /api/screen
  → Backend processes each symbol
  → Returns sorted results
  → Frontend displays in table
```

### 2. Data Processing Pipeline

```
Symbol → Fetch Spot Price → Fetch Option Chain → Filter Monthly Expiries
  → Select Target Expiry → Find ITM Option (Call/Put)
  → Calculate IV → Calculate EV → Calculate EV%
  → Apply Recommendation Logic → Return Result
```

## Component Architecture

### Frontend Components

#### 1. App.js (Main Container)
- State management for entire application
- Orchestrates data flow between components
- Error handling
- API communication

#### 2. SymbolSelector
- Search and filter stocks/indices
- Manage selected symbols
- Visual chip representation
- Max 50 symbol limit enforcement

#### 3. ControlPanel
- Strategy toggle (CCP/ACC)
- Expiry month selector
- Refresh data button
- Last update timestamp
- Strategy rules display

#### 4. ResultsTable
- Sortable data table
- Conditional formatting (YES/NO)
- Column sorting functionality
- Responsive design

#### 5. LoadingSpinner
- Visual feedback during API calls
- Prevents duplicate requests

### Backend Services

#### 1. nseService.js
- **Purpose:** Data fetching from NSE
- **Functions:**
  - `fetchSpotPrice(symbol)`: Get current price
  - `fetchOptionChain(symbol)`: Get option chain
  - `getMonthlyExpiries(dates)`: Filter monthly expiries
  - `calculateDaysToExpiry(date)`: Days remaining

#### 2. optionsLogic.js
- **Purpose:** Financial calculations
- **Functions:**
  - `calculateCallIV()`: Call intrinsic value
  - `calculatePutIV()`: Put intrinsic value
  - `calculateEV()`: Extrinsic value
  - `calculateEVPercentage()`: EV percentage
  - `findNearestITMCall()`: Select ITM call
  - `findNearestITMPut()`: Select ITM put
  - `getRecommendation()`: Apply threshold rules
  - `analyzeOption()`: Complete analysis

#### 3. mockDataService.js
- **Purpose:** Development/testing data
- **Functions:**
  - `generateMockSpotPrice()`: Realistic prices
  - `generateMockOptionChain()`: Complete option chain
  - `getNextFourMonthlyExpiries()`: Expiry dates

### Backend Routes

#### 1. /api/stocks (GET)
- Returns predefined list of stocks/indices
- No authentication required
- Cached response

#### 2. /api/screen (POST)
- Main screening endpoint
- Validates input parameters
- Parallel processing of symbols
- Returns sorted results

#### 3. /api/expiries/:symbol (GET)
- Get available expiries for symbol
- Useful for UI validation
- Cached per symbol

## Key Algorithms

### ITM Option Selection

**For PUT (CCP Strategy):**
```javascript
ITM Puts = Puts where Strike > Spot
Nearest ITM = Put with lowest strike above spot
```

**For CALL (ACC Strategy):**
```javascript
ITM Calls = Calls where Strike < Spot
Nearest ITM = Call with highest strike below spot
```

### Recommendation Logic
```javascript
if (isIndex(symbol)) {
  threshold = 1.0%
} else {
  threshold = 2.0%
}

if (evPercentage > threshold) {
  recommendation = "YES"
} else {
  recommendation = "NO"
}
```

### Sorting
- Default: EV% descending (highest first)
- User can sort by any column
- Maintains sort state in React

## Caching Strategy

### Cache Implementation
- **Library:** node-cache
- **TTL:** 30 seconds (configurable)
- **Key Format:** `{symbol}-{strategy}-{expiryMonth}`
- **Scope:** Per request combination

### Cache Invalidation
- Automatic after TTL expires
- Manual via refresh button
- No persistent storage

## Error Handling

### Frontend
```javascript
try {
  // API call
} catch (error) {
  // Display user-friendly message
  // Log to console
  // Don't break UI
}
```

### Backend
```javascript
try {
  // Data processing
} catch (error) {
  // Log error details
  // Return error response with message
  // Continue with next symbol
}
```

## Performance Considerations

### Optimizations
1. **Caching:** 30s cache reduces API calls
2. **Parallel Processing:** Process symbols concurrently
3. **Lazy Loading:** Components load on demand
4. **Debouncing:** Search input debounced
5. **Memoization:** React components optimized

### Limitations
- Max 50 symbols per scan
- 30s cache may miss rapid price changes
- NSE API rate limiting (real mode)

## Security Considerations

### Current Implementation
- No authentication (educational app)
- CORS enabled for development
- Input validation on backend
- No sensitive data storage

### Production Recommendations
1. Add API key authentication
2. Implement rate limiting
3. Use HTTPS only
4. Sanitize all inputs
5. Add request logging
6. Implement user sessions

## Scalability

### Current Capacity
- Handles 50 symbols per request
- Single server deployment
- In-memory caching

### Scaling Options
1. **Horizontal:** Load balancer + multiple servers
2. **Caching:** Redis for distributed cache
3. **Database:** PostgreSQL for historical data
4. **Queue:** Bull/RabbitMQ for async processing
5. **CDN:** CloudFlare for static assets

## Future Enhancements

### Phase 2 Features
- Historical EV% tracking
- Backtesting capabilities
- Greeks calculation (Delta, Theta, Vega)
- Implied volatility analysis
- Portfolio tracking

### Integration Options
- Broker API integration (Zerodha, Upstox)
- Automated trade execution
- Alert notifications (email, SMS)
- Mobile app (React Native)
- Real-time WebSocket updates

## Testing Strategy

### Unit Tests (To Implement)
- Business logic functions
- IV/EV calculations
- Option selection logic

### Integration Tests
- API endpoint testing
- Mock data validation

### E2E Tests
- User flow testing
- Complete screening workflow

## Deployment Architecture

### Development
```
Local Machine → Node.js Dev Server (Port 5000)
              → React Dev Server (Port 3000)
```

### Production
```
Option 1: Single Server
  → Node.js serves both API and static frontend
  
Option 2: Separate
  → API: Heroku/AWS/DigitalOcean
  → Frontend: Netlify/Vercel
```

## Monitoring & Logging

### Current
- Console logs for errors
- Request/response logging

### Recommended for Production
- Winston/Bunyan for structured logging
- Application monitoring (New Relic, DataDog)
- Error tracking (Sentry)
- Performance monitoring (APM)

## Code Quality

### Standards
- ES6+ JavaScript
- Functional programming style
- JSDoc comments for functions
- Modular architecture
- Separation of concerns

### Best Practices
- DRY (Don't Repeat Yourself)
- Single Responsibility Principle
- Clean variable naming
- Inline comments for complex logic
