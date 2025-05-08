import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, inputRef }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for snacks, drinks, or buildings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        ref={inputRef}
        aria-label="Search for snacks, drinks, or buildings"
      />
      <button type="submit" className="search-button" aria-label="Search">
        Search
      </button>
    </form>
  );
}

export default SearchBar;