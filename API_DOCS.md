# API DOCUMENTATION

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Get Available Stocks

**Endpoint:** `GET /api/stocks`

**Description:** Returns list of available stocks and indices for screening.

**Response:**
```json
{
  "success": true,
  "stocks": [
    {
      "symbol": "NIFTY",
      "name": "NIFTY 50",
      "type": "INDEX"
    },
    {
      "symbol": "RELIANCE",
      "name": "Reliance Industries",
      "type": "STOCK"
    }
  ]
}
```

---

### 2. Screen Stocks

**Endpoint:** `POST /api/screen`

**Description:** Screen multiple stocks/indices for CCP or ACC opportunities.

**Request Body:**
```json
{
  "symbols": ["NIFTY", "RELIANCE", "TCS"],
  "strategy": "CCP",
  "expiryMonth": 0
}
```

**Parameters:**
- `symbols` (array, required): List of stock/index symbols (max 50)
- `strategy` (string, required): "CCP" or "ACC"
- `expiryMonth` (number, required): 0, 1, 2, or 3

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "symbol": "RELIANCE",
      "optionType": "PUT",
      "strikePrice": 2450.00,
      "optionLTP": 85.50,
      "intrinsicValue": 25.30,
      "extrinsicValue": 60.20,
      "evPercentage": 2.46,
      "daysToExpiry": 12,
      "recommendation": "YES",
      "spotPrice": 2424.70
    }
  ],
  "errors": [],
  "timestamp": "2026-01-29T10:30:00.000Z"
}
```

**Error Handling:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### 3. Get Expiries for Symbol

**Endpoint:** `GET /api/expiries/:symbol`

**Description:** Get available monthly expiry dates for a symbol.

**Example:** `GET /api/expiries/NIFTY`

**Response:**
```json
{
  "success": true,
  "symbol": "NIFTY",
  "expiries": [
    {
      "month": 0,
      "date": "2026-01-29",
      "daysToExpiry": 0
    },
    {
      "month": 1,
      "date": "2026-02-26",
      "daysToExpiry": 28
    }
  ]
}
```

---

### 4. Health Check

**Endpoint:** `GET /health`

**Description:** Check if server is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-29T10:30:00.000Z"
}
```

## Business Logic

### Intrinsic Value (IV)

**CALL Option:**
```
IV = max(Spot Price - Strike Price, 0)
```

**PUT Option:**
```
IV = max(Strike Price - Spot Price, 0)
```

### Extrinsic Value (EV)
```
EV = Option LTP - IV
```

### EV Percentage
```
EV% = (EV / Strike Price) × 100
```

### Recommendation Logic

**Index (NIFTY, BANKNIFTY, FINNIFTY):**
- Recommend if EV% > 1%

**Stocks:**
- Recommend if EV% > 2%

### Option Selection

**CCP (Cash Covered Put):**
- Selects nearest ITM PUT option
- ITM = Strike > Spot Price
- Chooses lowest strike above spot

**ACC (Asset Covered Call):**
- Selects nearest ITM CALL option
- ITM = Strike < Spot Price
- Chooses highest strike below spot

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting implemented.
For production, implement:
- Max 60 requests per minute per IP
- Cache results for 30 seconds

## Data Caching

Results cached for 30 seconds (TTL configurable).
Cache key format: `{symbol}-{strategy}-{expiryMonth}`

## Examples

### Example 1: Screen NIFTY for CCP
```bash
curl -X POST http://localhost:5000/api/screen \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["NIFTY"],
    "strategy": "CCP",
    "expiryMonth": 0
  }'
```

### Example 2: Screen Multiple Stocks for ACC
```bash
curl -X POST http://localhost:5000/api/screen \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["RELIANCE", "TCS", "INFY"],
    "strategy": "ACC",
    "expiryMonth": 1
  }'
```

### Example 3: Get Available Stocks
```bash
curl http://localhost:5000/api/stocks
```

## Notes

- All prices in INR (₹)
- Dates in ISO 8601 format
- Times in IST (Indian Standard Time)
- Option chain data from NSE derivatives segment
- Only monthly expiries supported (last Thursday of month)
