import React from 'react';
import './ControlPanel.css';

function ControlPanel({ 
  strategy, 
  setStrategy, 
  expiryMonth, 
  setExpiryMonth, 
  onRefresh, 
  loading,
  lastUpdate 
}) {
  const expiryOptions = [
    { value: 0, label: 'Current Month (0)' },
    { value: 1, label: 'Next Month (+1)' },
    { value: 2, label: '+2 Months' },
    { value: 3, label: '+3 Months' }
  ];

  return (
    <div className="control-panel">
      <div className="controls-grid">
        {/* Strategy Toggle */}
        <div className="control-group">
          <label className="control-label">Strategy</label>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${strategy === 'CCP' ? 'active' : ''}`}
              onClick={() => setStrategy('CCP')}
            >
              🛡️ CCP (ITM PUT)
            </button>
            <button
              className={`toggle-btn ${strategy === 'ACC' ? 'active' : ''}`}
              onClick={() => setStrategy('ACC')}
            >
              📈 ACC (ITM CALL)
            </button>
          </div>
          <p className="helper-text">
            {strategy === 'CCP' 
              ? 'Cash Covered Put - Sell ITM Puts' 
              : 'Asset Covered Call - Sell ITM Calls'}
          </p>
        </div>

        {/* Expiry Selector */}
        <div className="control-group">
          <label className="control-label">Expiry Month</label>
          <select
            className="select-input"
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(Number(e.target.value))}
          >
            {expiryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="helper-text">Monthly expiries only</p>
        </div>

        {/* Refresh Button */}
        <div className="control-group">
          <label className="control-label">Data</label>
          <button
            className="refresh-btn"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Loading...
              </>
            ) : (
              <>
                🔄 Refresh Data
              </>
            )}
          </button>
          {lastUpdate && (
            <p className="helper-text">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Strategy Info */}
      <div className="info-box">
        <h3>Strategy Rules</h3>
        <ul>
          <li><strong>Index (e.g., NIFTY):</strong> Recommend if EV% &gt; 1%</li>
          <li><strong>Stocks:</strong> Recommend if EV% &gt; 2%</li>
          <li><strong>Sorting:</strong> Results sorted by EV% (highest first)</li>
        </ul>
      </div>
    </div>
  );
}

export default ControlPanel;
