import React, { useState } from 'react';
import './ResultsTable.css';

function ResultsTable({ results, strategy }) {
  const [sortConfig, setSortConfig] = useState({ 
    key: 'evPercentage', 
    direction: 'desc' 
  });

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort results based on current sort config
  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aVal > bVal) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '⇅';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="results-section">
      <div className="results-header">
        <h2>Screening Results</h2>
        <div className="stats">
          <span className="stat-badge">
            Total: {results.length}
          </span>
          <span className="stat-badge success">
            Recommended: {results.filter(r => r.recommendation === 'YES').length}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('symbol')} className="sortable">
                Symbol {getSortIcon('symbol')}
              </th>
              <th onClick={() => handleSort('optionType')} className="sortable">
                Option Type {getSortIcon('optionType')}
              </th>
              <th onClick={() => handleSort('strikePrice')} className="sortable">
                Strike Price {getSortIcon('strikePrice')}
              </th>
              <th onClick={() => handleSort('optionLTP')} className="sortable">
                Option LTP {getSortIcon('optionLTP')}
              </th>
              <th onClick={() => handleSort('intrinsicValue')} className="sortable">
                Intrinsic Value {getSortIcon('intrinsicValue')}
              </th>
              <th onClick={() => handleSort('extrinsicValue')} className="sortable">
                Extrinsic Value {getSortIcon('extrinsicValue')}
              </th>
              <th onClick={() => handleSort('evPercentage')} className="sortable highlight">
                EV % {getSortIcon('evPercentage')}
              </th>
              <th onClick={() => handleSort('daysToExpiry')} className="sortable">
                Days to Expiry {getSortIcon('daysToExpiry')}
              </th>
              <th onClick={() => handleSort('recommendation')} className="sortable">
                Recommendation {getSortIcon('recommendation')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result, index) => (
              <tr key={`${result.symbol}-${index}`} className={result.recommendation === 'YES' ? 'recommended' : ''}>
                <td className="symbol-cell">
                  <strong>{result.symbol}</strong>
                  <span className="spot-price">₹{result.spotPrice}</span>
                </td>
                <td>
                  <span className={`option-badge ${result.optionType.toLowerCase()}`}>
                    {result.optionType}
                  </span>
                </td>
                <td className="number">₹{result.strikePrice.toFixed(2)}</td>
                <td className="number">₹{result.optionLTP.toFixed(2)}</td>
                <td className="number">₹{result.intrinsicValue.toFixed(2)}</td>
                <td className="number highlight-ev">₹{result.extrinsicValue.toFixed(2)}</td>
                <td className="number highlight-ev-percent">
                  <strong>{result.evPercentage.toFixed(2)}%</strong>
                </td>
                <td className="number">{result.daysToExpiry}</td>
                <td>
                  <span className={`recommendation-badge ${result.recommendation.toLowerCase()}`}>
                    {result.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>
          <strong>Note:</strong> Results are sorted by EV% (highest first). 
          Click column headers to sort by different criteria.
        </p>
      </div>
    </div>
  );
}

export default ResultsTable;
