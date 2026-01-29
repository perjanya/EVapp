import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SymbolSelector from './components/SymbolSelector';
import ControlPanel from './components/ControlPanel';
import ResultsTable from './components/ResultsTable';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  // State management
  const [availableStocks, setAvailableStocks] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [strategy, setStrategy] = useState('CCP'); // CCP or ACC
  const [expiryMonth, setExpiryMonth] = useState(0); // 0, 1, 2, 3
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch available stocks on mount
  useEffect(() => {
    fetchAvailableStocks();
  }, []);

  const fetchAvailableStocks = async () => {
    try {
      const response = await axios.get('/api/stocks');
      if (response.data.success) {
        setAvailableStocks(response.data.stocks);
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError('Failed to load stock list');
    }
  };

  const handleAddSymbol = (symbol) => {
    if (selectedSymbols.length >= 50) {
      alert('Maximum 50 symbols allowed');
      return;
    }
    if (!selectedSymbols.includes(symbol)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const handleRemoveSymbol = (symbol) => {
    setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
  };

  const handleRefresh = async () => {
    if (selectedSymbols.length === 0) {
      alert('Please select at least one symbol');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/screen', {
        symbols: selectedSymbols,
        strategy,
        expiryMonth
      });

      if (response.data.success) {
        setResults(response.data.results);
        setLastUpdate(new Date());
        
        // Show errors if any
        if (response.data.errors && response.data.errors.length > 0) {
          console.warn('Some symbols failed:', response.data.errors);
        }
      }
    } catch (err) {
      console.error('Error screening:', err);
      setError(err.response?.data?.error || 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📊 Options Screening App</h1>
        <p className="subtitle">High Extrinsic Value Opportunities - NSE Market</p>
      </header>

      <div className="container">
        {/* Symbol Selector */}
        <SymbolSelector
          availableStocks={availableStocks}
          selectedSymbols={selectedSymbols}
          onAddSymbol={handleAddSymbol}
          onRemoveSymbol={handleRemoveSymbol}
        />

        {/* Control Panel */}
        <ControlPanel
          strategy={strategy}
          setStrategy={setStrategy}
          expiryMonth={expiryMonth}
          setExpiryMonth={setExpiryMonth}
          onRefresh={handleRefresh}
          loading={loading}
          lastUpdate={lastUpdate}
        />

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Results Table */}
        {!loading && results.length > 0 && (
          <ResultsTable results={results} strategy={strategy} />
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && selectedSymbols.length > 0 && (
          <div className="empty-state">
            <p>Click "Refresh Data" to screen selected symbols</p>
          </div>
        )}

        {!loading && selectedSymbols.length === 0 && (
          <div className="empty-state">
            <p>Select symbols to begin screening</p>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>© 2026 Options Screening App | NSE Market Data</p>
        <p className="disclaimer">For educational purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
}

export default App;
