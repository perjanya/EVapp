# USER GUIDE
## Options Screening Application

---

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Understanding the Interface](#understanding-the-interface)
4. [How to Use](#how-to-use)
5. [Understanding Results](#understanding-results)
6. [Strategies Explained](#strategies-explained)
7. [Tips & Best Practices](#tips--best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Glossary](#glossary)

---

## Introduction

### What is this app?
This application helps you identify high Extrinsic Value (EV) opportunities in the NSE (National Stock Exchange of India) options market for two popular income strategies:

1. **Cash Covered Put (CCP)** - Selling ITM PUT options
2. **Asset Covered Call (ACC)** - Selling ITM CALL options

### Who is this for?
- Options traders looking for income opportunities
- Investors exploring covered strategies
- Anyone wanting to screen multiple stocks quickly
- Educational purposes for understanding options pricing

### What does it do?
- Fetches real-time spot prices and option chains
- Calculates Intrinsic Value (IV) and Extrinsic Value (EV)
- Identifies the nearest ITM option for your selected strategy
- Provides clear YES/NO recommendations based on EV%
- Sorts opportunities by highest EV% for priority execution

---

## Getting Started

### Installation
1. **Run the quick start script:**
   ```
   Double-click: start.bat (Windows)
   ```

2. **Manual start:**
   ```bash
   npm install
   cd client
   npm install
   cd ..
   npm run dev
   ```

3. **Access the app:**
   - Open browser: http://localhost:3000

### First Time Setup
- No registration required
- No API keys needed (using mock data by default)
- Works offline with simulated data

---

## Understanding the Interface

### 1. Header Section
- **Title:** "📊 Options Screening App"
- **Subtitle:** Shows current market (NSE)

### 2. Symbol Selector Panel
- **Search Box:** Type to search stocks/indices
- **Dropdown:** Shows matching results
- **Selected Chips:** Your chosen symbols (max 50)
- **Remove Button (×):** Click to remove symbols

### 3. Control Panel
Has three sections:

#### Strategy Selection
- **🛡️ CCP (ITM PUT)** button
- **📈 ACC (ITM CALL)** button
- Helper text explains current selection

#### Expiry Month Dropdown
- **Current Month (0)** - This month's expiry
- **Next Month (+1)** - Next month's expiry
- **+2 Months** - Two months out
- **+3 Months** - Three months out

#### Refresh Button
- **🔄 Refresh Data** - Fetches latest market data
- Shows spinner when loading
- Displays last update time

### 4. Strategy Rules Box
Shows current recommendation thresholds:
- **Index:** EV% > 1%
- **Stocks:** EV% > 2%

### 5. Results Table
Displays screening results with 9 columns:
- Symbol
- Option Type (PUT/CALL)
- Strike Price
- Option LTP (Last Traded Price)
- Intrinsic Value
- Extrinsic Value
- EV %
- Days to Expiry
- Recommendation (YES/NO)

---

## How to Use

### Step-by-Step Workflow

#### Step 1: Select Symbols
1. Click in the search box
2. Type stock name or symbol (e.g., "RELIANCE" or "NIFTY")
3. Click on the stock from dropdown
4. Repeat to add more symbols (max 50)

**Example Selections:**
- NIFTY (Index)
- BANKNIFTY (Index)
- RELIANCE (Stock)
- TCS (Stock)
- INFY (Stock)

#### Step 2: Choose Strategy
Click one of the strategy buttons:

**For CCP (Cash Covered Put):**
- Click "🛡️ CCP (ITM PUT)" button
- App will find ITM PUT options
- Good for: Acquiring stocks at discount

**For ACC (Asset Covered Call):**
- Click "📈 ACC (ITM CALL)" button
- App will find ITM CALL options
- Good for: Generating income on holdings

#### Step 3: Select Expiry Month
Choose from dropdown:
- **0** = Current month (nearest expiry)
- **1** = Next month
- **2** = Two months ahead
- **3** = Three months ahead

**Recommendation:** Start with current month (0) for fastest time decay.

#### Step 4: Refresh Data
1. Click "🔄 Refresh Data" button
2. Wait for loading spinner
3. Results appear automatically

#### Step 5: Review Results
Table shows all opportunities sorted by EV% (highest first).

**Look for:**
- ✅ **GREEN "YES"** recommendations
- 💰 **High EV%** values
- ⏰ **Appropriate days to expiry**

---

## Understanding Results

### Table Columns Explained

#### 1. Symbol
- Stock or index name
- Shows current spot price below symbol
- **Example:** RELIANCE ₹2,450.00

#### 2. Option Type
- **PUT** - Red badge (CCP strategy)
- **CALL** - Green badge (ACC strategy)

#### 3. Strike Price
- The strike price of selected option
- In rupees (₹)
- **Example:** ₹2,500.00

#### 4. Option LTP
- Last Traded Price of the option
- Current market price
- **Example:** ₹85.50

#### 5. Intrinsic Value (IV)
- Real value if exercised today
- Never negative
- **CALL:** max(Spot - Strike, 0)
- **PUT:** max(Strike - Spot, 0)

#### 6. Extrinsic Value (EV)
- **Highlighted in yellow**
- Time value + volatility premium
- **Formula:** Option LTP - Intrinsic Value
- This is the premium you capture!

#### 7. EV % ⭐
- **Most Important Column**
- **Highlighted in orange**
- Shows EV as percentage of strike
- **Formula:** (EV / Strike) × 100
- Higher = Better opportunity

#### 8. Days to Expiry
- Calendar days until option expires
- **More days** = More time decay potential
- **Fewer days** = Faster decay, higher risk

#### 9. Recommendation
- **GREEN "YES"** = Meets threshold, worth considering
- **RED "NO"** = Below threshold, skip

### Sorting Results
- **Default:** Sorted by EV% (highest first)
- **Click any column header** to sort
- **Click again** to reverse sort direction
- **Arrows show sort direction:** ↑ (ascending) ↓ (descending)

### Color Coding
| Color | Meaning |
|-------|---------|
| 🟢 Green Row | Recommended opportunity (YES) |
| ⚪ White Row | Not recommended (NO) |
| 🟡 Yellow Cell | Extrinsic Value column |
| 🟠 Orange Cell | EV% column (key metric) |
| 🔴 Red Badge | PUT option |
| 🟢 Green Badge | CALL option |

---

## Strategies Explained

### Cash Covered Put (CCP)

**What is it?**
Selling an ITM PUT option while keeping cash ready to buy the stock.

**How it works:**
1. You sell a PUT option at strike price (e.g., ₹2,500)
2. Collect premium (Option LTP)
3. If assigned, you buy stock at ₹2,500
4. You keep the premium either way

**Why use this app:**
- Find options with high EV (maximum premium)
- EV% > 2% for stocks (or 1% for indices)
- Higher EV = More income

**Example:**
- Stock: RELIANCE
- Spot: ₹2,450
- Selected PUT Strike: ₹2,500 (ITM)
- PUT LTP: ₹85.50
- Intrinsic Value: ₹50 (2500 - 2450)
- Extrinsic Value: ₹35.50 (85.50 - 50)
- EV%: 1.42% (35.50 / 2500 × 100)
- **Result:** NO (below 2% threshold for stocks)

### Asset Covered Call (ACC)

**What is it?**
Selling an ITM CALL option on stocks you already own.

**How it works:**
1. You own the stock (e.g., 100 shares at ₹2,400)
2. Sell ITM CALL at strike ₹2,450
3. Collect premium
4. If assigned, sell stock at ₹2,450 (profit) + keep premium

**Why use this app:**
- Maximize income on holdings
- Find high EV% opportunities
- Exit positions with extra premium

**Example:**
- Stock: TCS
- Spot: ₹3,650
- Own 100 shares
- Selected CALL Strike: ₹3,600 (ITM)
- CALL LTP: ₹125.00
- Intrinsic Value: ₹50 (3650 - 3600)
- Extrinsic Value: ₹75.00 (125 - 50)
- EV%: 2.08% (75 / 3600 × 100)
- **Result:** YES ✅ (above 2% threshold)

---

## Tips & Best Practices

### Symbol Selection
✅ **DO:**
- Mix indices and stocks
- Focus on liquid securities
- Choose stocks you'd be comfortable owning (CCP)
- Choose stocks you're willing to sell (ACC)

❌ **DON'T:**
- Select too many illiquid stocks
- Exceed 50 symbols (app limit)
- Choose unfamiliar companies

### Expiry Selection
✅ **DO:**
- Start with current month (fastest decay)
- Compare multiple expiries
- Consider your capital availability

❌ **DON'T:**
- Only look at far expiries (lower EV%)
- Ignore days to expiry

### Interpreting Results
✅ **DO:**
- Sort by EV% for best opportunities
- Check days to expiry
- Verify spot price makes sense
- Look for GREEN "YES" recommendations

❌ **DON'T:**
- Ignore RED "NO" recommendations
- Only look at one metric
- Skip due diligence on the underlying

### Risk Management
✅ **DO:**
- Only use capital you can afford to lock
- Understand assignment risk
- Have cash ready for CCP
- Own shares for ACC
- Diversify across sectors

❌ **DON'T:**
- Use all capital on one trade
- Sell uncovered options
- Ignore market conditions
- Trade without stop losses

### Execution
✅ **DO:**
- Verify prices before executing
- Check option liquidity (Open Interest)
- Use limit orders
- Review Greeks if available
- Calculate margin requirements

❌ **DON'T:**
- Blindly execute recommendations
- Use market orders on illiquid options
- Ignore bid-ask spreads
- Over-leverage

---

## Troubleshooting

### App Won't Load
**Problem:** Blank screen or errors
**Solutions:**
1. Check if backend is running (http://localhost:5000/health)
2. Check if frontend is running (http://localhost:3000)
3. Clear browser cache
4. Restart servers: `npm run dev`

### "No symbols selected" Error
**Problem:** Can't refresh data
**Solution:** Add at least one symbol using search box

### Symbols Not Appearing
**Problem:** Search returns no results
**Solutions:**
1. Check spelling (use correct NSE symbols)
2. Use capital letters: "RELIANCE" not "reliance"
3. Check if symbol is in the list (`/api/stocks`)

### Loading Forever
**Problem:** Spinner doesn't stop
**Solutions:**
1. Check browser console for errors (F12)
2. Verify backend is running
3. Check network tab for failed requests
4. Restart app

### Incorrect Data
**Problem:** Prices look wrong
**Solutions:**
1. App uses **mock data by default**
2. Check `.env` file: `USE_MOCK_DATA=true`
3. To use real data: Set `USE_MOCK_DATA=false` (requires NSE API setup)
4. Click refresh to update cached data

### Port Already in Use
**Problem:** "Port 5000 already in use"
**Solutions:**
1. Close other apps using port 5000
2. Change port in `.env`: `PORT=5001`
3. Kill process: `taskkill /F /IM node.exe` (Windows)

---

## Glossary

### Options Terms

**ITM (In The Money)**
- CALL: Strike < Spot (has intrinsic value)
- PUT: Strike > Spot (has intrinsic value)

**OTM (Out of The Money)**
- CALL: Strike > Spot (no intrinsic value)
- PUT: Strike < Spot (no intrinsic value)

**ATM (At The Money)**
- Strike ≈ Spot (at or near current price)

**LTP (Last Traded Price)**
- Most recent transaction price for the option

**Intrinsic Value (IV)**
- Real value if option exercised immediately
- CALL: Spot - Strike (if positive)
- PUT: Strike - Spot (if positive)

**Extrinsic Value (EV)**
- Time value + volatility premium
- The "extra" premium above intrinsic value
- This is what sellers capture!

**Strike Price**
- The price at which option can be exercised
- Fixed when option is created

**Spot Price**
- Current market price of underlying stock/index

**Expiry Date**
- Last day option can be traded/exercised
- Monthly expiries = Last Thursday of month

**Premium**
- Price paid/received for the option
- Same as LTP

### Strategy Terms

**CCP (Cash Covered Put)**
- Selling PUT with cash reserved
- Obligation to buy stock if assigned
- Income strategy

**ACC (Asset Covered Call)**
- Selling CALL on owned stock
- Obligation to sell stock if assigned
- Income + exit strategy

**Assignment**
- When option is exercised against you
- You must fulfill obligation
- CCP: Buy stock at strike
- ACC: Sell stock at strike

**EV Percentage (EV%)**
- Extrinsic Value as % of strike price
- Key metric for opportunity quality
- Higher = Better income potential

---

## Support & Resources

### For Help
- Check DEPLOYMENT.md for installation issues
- Check API_DOCS.md for technical details
- Check ARCHITECTURE.md for system design

### Disclaimer
⚠️ **IMPORTANT:**
- This app is for **educational purposes only**
- **NOT financial advice**
- Verify all data before trading
- Options trading involves significant risk
- Past performance doesn't guarantee future results
- Consult a licensed financial advisor

### Legal
- No guarantee of accuracy
- Use at your own risk
- Not responsible for trading losses
- NSE data subject to exchange policies

---

## Quick Reference Card

### Recommendation Thresholds
| Asset Type | Minimum EV% |
|------------|-------------|
| Index | > 1% |
| Stock | > 2% |

### Key Formulas
```
Intrinsic Value (CALL) = max(Spot - Strike, 0)
Intrinsic Value (PUT) = max(Strike - Spot, 0)
Extrinsic Value = Option LTP - Intrinsic Value
EV% = (EV / Strike) × 100
```

### Color Guide
- 🟢 Green = Recommended (YES)
- 🔴 Red = Not Recommended (NO)
- 🟡 Yellow = Extrinsic Value
- 🟠 Orange = EV% (priority metric)

### Keyboard Shortcuts
- **Refresh Data:** Click button or F5 (browser refresh)
- **Search Symbols:** Click search box or Tab to it

---

**Happy Screening! 📊📈**
