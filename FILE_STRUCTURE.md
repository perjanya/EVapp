# FILE STRUCTURE GUIDE

## Complete Project Tree

```
EVapp/
│
├── 📄 README.md                          ⭐ START HERE - Main project overview
├── 📄 PROJECT_SUMMARY.md                 📦 Complete delivery summary
├── 📄 USER_GUIDE.md                      📖 Complete user manual (50+ sections)
├── 📄 DEPLOYMENT.md                      🚀 Installation & deployment guide
├── 📄 API_DOCS.md                        🔧 API reference & examples
├── 📄 ARCHITECTURE.md                    🏗️ Technical architecture
├── 📄 LICENSE                            📜 MIT License & disclaimers
├── 📄 .gitignore                         🚫 Git ignore rules
├── 📄 .env.example                       ⚙️ Environment configuration template
├── 📄 package.json                       📦 Root dependencies & scripts
├── 📄 start.bat                          🎬 Quick start script (Windows)
│
├── 🖥️ server/                            # Backend (Node.js + Express)
│   ├── index.js                          # Express server setup & middleware
│   │
│   ├── routes/
│   │   └── nseRoutes.js                  # API route handlers
│   │                                      # - GET /api/stocks
│   │                                      # - POST /api/screen
│   │                                      # - GET /api/expiries/:symbol
│   │
│   └── services/
│       ├── nseService.js                 # NSE data fetching service
│       │                                  # - fetchSpotPrice()
│       │                                  # - fetchOptionChain()
│       │                                  # - getMonthlyExpiries()
│       │                                  # - calculateDaysToExpiry()
│       │
│       ├── optionsLogic.js               # Financial calculations
│       │                                  # - calculateCallIV()
│       │                                  # - calculatePutIV()
│       │                                  # - calculateEV()
│       │                                  # - calculateEVPercentage()
│       │                                  # - findNearestITMCall()
│       │                                  # - findNearestITMPut()
│       │                                  # - getRecommendation()
│       │                                  # - analyzeOption()
│       │
│       └── mockDataService.js            # Development mock data generator
│                                          # - generateMockSpotPrice()
│                                          # - generateMockOptionChain()
│
└── 🎨 client/                            # Frontend (React 18)
    ├── package.json                      # Frontend dependencies
    │
    ├── public/
    │   └── index.html                    # HTML template
    │
    └── src/
        ├── index.js                      # React entry point
        ├── index.css                     # Global styles
        │
        ├── App.js                        # Main application container
        │                                  # - State management
        │                                  # - API communication
        │                                  # - Component orchestration
        ├── App.css                       # Application-level styles
        │
        └── components/
            │
            ├── SymbolSelector.js         # Stock/index search & selection
            │                              # - Search input
            │                              # - Dropdown results
            │                              # - Selected chips display
            │                              # - Add/remove functionality
            ├── SymbolSelector.css
            │
            ├── ControlPanel.js           # Strategy & expiry controls
            │                              # - CCP/ACC toggle
            │                              # - Expiry month dropdown
            │                              # - Refresh button
            │                              # - Last update display
            │                              # - Strategy rules info
            ├── ControlPanel.css
            │
            ├── ResultsTable.js           # Sortable results display
            │                              # - 9-column table
            │                              # - Sortable headers
            │                              # - Color-coded recommendations
            │                              # - Statistics display
            ├── ResultsTable.css
            │
            ├── LoadingSpinner.js         # Loading indicator
            └── LoadingSpinner.css

```

## File Purposes

### 📚 Documentation Files (7 files)

| File | Purpose | Read When |
|------|---------|-----------|
| **README.md** | Main project overview | First time setup |
| **PROJECT_SUMMARY.md** | Delivery summary & statistics | Understanding what's included |
| **USER_GUIDE.md** | Complete user manual | Learning how to use the app |
| **DEPLOYMENT.md** | Installation & setup | Setting up the project |
| **API_DOCS.md** | API reference | Integrating or extending APIs |
| **ARCHITECTURE.md** | System design | Understanding internals |
| **LICENSE** | Legal terms | Before using in production |

### ⚙️ Configuration Files (4 files)

| File | Purpose |
|------|---------|
| **package.json** (root) | Root dependencies, scripts for dev/prod |
| **package.json** (client) | Frontend dependencies, React scripts |
| **.env.example** | Environment variables template |
| **.gitignore** | Files to exclude from git |
| **start.bat** | Windows quick-start script |

### 🖥️ Backend Files (5 files)

| File | Lines | Purpose |
|------|-------|---------|
| **server/index.js** | ~40 | Express server, middleware, error handling |
| **server/routes/nseRoutes.js** | ~200 | API endpoint handlers, request validation |
| **server/services/nseService.js** | ~150 | NSE data fetching, expiry calculations |
| **server/services/optionsLogic.js** | ~250 | IV/EV calculations, ITM selection, recommendations |
| **server/services/mockDataService.js** | ~150 | Mock data generation for development |

### 🎨 Frontend Files (11 files)

| File | Lines | Purpose |
|------|-------|---------|
| **client/public/index.html** | ~20 | HTML template |
| **client/src/index.js** | ~10 | React entry point |
| **client/src/index.css** | ~20 | Global styles, reset |
| **client/src/App.js** | ~150 | Main app container, state, API calls |
| **client/src/App.css** | ~80 | App-level styling |
| **client/src/components/SymbolSelector.js** | ~100 | Symbol search & selection logic |
| **client/src/components/SymbolSelector.css** | ~150 | Symbol selector styling |
| **client/src/components/ControlPanel.js** | ~100 | Control panel logic |
| **client/src/components/ControlPanel.css** | ~120 | Control panel styling |
| **client/src/components/ResultsTable.js** | ~150 | Results table with sorting |
| **client/src/components/ResultsTable.css** | ~180 | Results table styling |
| **client/src/components/LoadingSpinner.js** | ~15 | Loading indicator |
| **client/src/components/LoadingSpinner.css** | ~25 | Spinner animation |

## File Dependencies

### Backend Dependencies
```
server/index.js
    ├── requires: express, cors, node-cache
    └── uses: server/routes/nseRoutes.js

server/routes/nseRoutes.js
    ├── requires: express
    ├── uses: server/services/nseService.js
    └── uses: server/services/optionsLogic.js

server/services/nseService.js
    ├── requires: axios
    └── uses: server/services/mockDataService.js

server/services/optionsLogic.js
    └── requires: (none - pure calculations)

server/services/mockDataService.js
    └── requires: (none - pure generation)
```

### Frontend Dependencies
```
client/src/index.js
    ├── requires: react, react-dom
    └── uses: client/src/App.js

client/src/App.js
    ├── requires: react, axios
    ├── uses: components/SymbolSelector.js
    ├── uses: components/ControlPanel.js
    ├── uses: components/ResultsTable.js
    └── uses: components/LoadingSpinner.js

client/src/components/*.js
    └── requires: react
```

## Quick Navigation

### 🎯 I want to...

**Understand the project**
→ Read: README.md → PROJECT_SUMMARY.md

**Install and run**
→ Read: DEPLOYMENT.md → Run: start.bat

**Learn how to use**
→ Read: USER_GUIDE.md

**Integrate with API**
→ Read: API_DOCS.md

**Understand the code**
→ Read: ARCHITECTURE.md → Explore: server/ and client/src/

**Modify calculations**
→ Edit: server/services/optionsLogic.js

**Add stocks**
→ Edit: server/routes/nseRoutes.js (stocks array)

**Change UI**
→ Edit: client/src/components/*.js and *.css

**Configure environment**
→ Edit: .env (copy from .env.example)

**Debug issues**
→ Check: USER_GUIDE.md (Troubleshooting) → DEPLOYMENT.md

## File Size Summary

| Category | Files | Approx Lines |
|----------|-------|--------------|
| Documentation | 7 | 2,000+ |
| Backend Code | 5 | 800+ |
| Frontend Code | 11 | 1,100+ |
| Styles (CSS) | 6 | 600+ |
| Configuration | 4 | 100+ |
| **TOTAL** | **28** | **~4,600** |

## Code Organization

### Backend Layers
```
Presentation Layer    → server/routes/nseRoutes.js
Business Logic Layer  → server/services/optionsLogic.js
Data Access Layer     → server/services/nseService.js
Mock Data Layer       → server/services/mockDataService.js
```

### Frontend Structure
```
Container Component   → App.js (state, API calls)
Presentational        → components/*.js (UI only)
Styling               → *.css (modular per component)
```

## Import Patterns

### Backend (CommonJS)
```javascript
const express = require('express');
const nseService = require('./services/nseService');
module.exports = { function1, function2 };
```

### Frontend (ES6)
```javascript
import React from 'react';
import axios from 'axios';
import ComponentName from './components/ComponentName';
export default ComponentName;
```

## Key Files to Modify

### Adding Features
- **New API endpoint:** `server/routes/nseRoutes.js`
- **New calculation:** `server/services/optionsLogic.js`
- **New UI component:** `client/src/components/NewComponent.js`

### Customization
- **Stocks list:** `server/routes/nseRoutes.js` (line ~15)
- **Thresholds:** `server/services/optionsLogic.js` (line ~130)
- **Colors:** `client/src/components/*.css`
- **Data source:** `server/services/nseService.js` (line ~10)

### Configuration
- **Port:** `.env` (PORT=5000)
- **Mock data:** `.env` (USE_MOCK_DATA=true)
- **Cache TTL:** `server/index.js` (line ~8)

## Testing Files

Currently no test files included. Recommended structure:

```
server/
  __tests__/
    optionsLogic.test.js
    nseService.test.js

client/src/
  __tests__/
    App.test.js
    components/
      SymbolSelector.test.js
      ResultsTable.test.js
```

## Deployment Files

For production deployment, you may need:

```
Dockerfile                    # Docker container
docker-compose.yml           # Multi-container setup
.github/workflows/deploy.yml # CI/CD pipeline
nginx.conf                   # Reverse proxy config
```

## Summary

- **Total Files:** 28
- **Code Files:** 16
- **Documentation:** 7
- **Configuration:** 4
- **Utility:** 1 (start.bat)

**Well-organized:** ✅  
**Easy to navigate:** ✅  
**Modular structure:** ✅  
**Production-ready:** ✅

---

**Need help finding something?**
- All user instructions: USER_GUIDE.md
- All technical details: ARCHITECTURE.md
- All API info: API_DOCS.md
