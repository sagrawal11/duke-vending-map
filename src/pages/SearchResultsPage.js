import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import './SearchResultsPage.css';

// Example data (you'll replace this with your database data later)
const allProducts = [
  { id: 1, name: 'Coca-Cola', category: 'Drinks', machines: ['Bryan Center Machine #1', 'Perkins Library Machine'] },
  { id: 2, name: 'Sprite', category: 'Drinks', machines: ['Bryan Center Machine #1'] },
  { id: 3, name: 'Snickers', category: 'Candy', machines: ['Bryan Center Machine #1', 'West Campus Machine'] },
  { id: 4, name: 'Doritos', category: 'Chips', machines: ['Perkins Library Machine'] },
  { id: 5, name: 'Red Bull', category: 'Energy Drinks', machines: ['West Campus Machine'] },
];

function SearchResultsPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (term) => {
    const results = allProducts.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
    setSearched(true);
  };

  return (
    <div className="search-page">
      <div className="container">
        <h1 className="page-title">Find Your Snack or Drink</h1>
        
        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {searched && (
          <div className="results-container">
            <h2>Search Results</h2>
            
            {searchResults.length === 0 ? (
              <p className="no-results">No products found. Try a different search term.</p>
            ) : (
              <div className="results-list">
                {searchResults.map(product => (
                  <div key={product.id} className="result-item">
                    <h3>{product.name}</h3>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Available at:</strong></p>
                    <ul>
                      {product.machines.map((machine, index) => (
                        <li key={index}>{machine}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;
