import React, { useState } from 'react';
import './SymbolSelector.css';

function SymbolSelector({ availableStocks, selectedSymbols, onAddSymbol, onRemoveSymbol }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter stocks based on search
  const filteredStocks = availableStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStock = (symbol) => {
    onAddSymbol(symbol);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="symbol-selector">
      <h2>Select Symbols (Max 50)</h2>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search stocks/indices..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
          onFocus={() => setShowDropdown(searchTerm.length > 0)}
        />
        
        {showDropdown && filteredStocks.length > 0 && (
          <div className="dropdown">
            {filteredStocks.slice(0, 10).map(stock => (
              <div
                key={stock.symbol}
                className="dropdown-item"
                onClick={() => handleSelectStock(stock.symbol)}
              >
                <span className="symbol">{stock.symbol}</span>
                <span className="name">{stock.name}</span>
                <span className={`badge ${stock.type.toLowerCase()}`}>
                  {stock.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="selected-symbols">
        <div className="count-badge">
          Selected: {selectedSymbols.length} / 50
        </div>
        <div className="symbols-chips">
          {selectedSymbols.length === 0 ? (
            <p className="no-selection">No symbols selected</p>
          ) : (
            selectedSymbols.map(symbol => (
              <div key={symbol} className="chip">
                <span>{symbol}</span>
                <button
                  className="remove-btn"
                  onClick={() => onRemoveSymbol(symbol)}
                  aria-label={`Remove ${symbol}`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SymbolSelector;
