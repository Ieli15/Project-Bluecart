import React, { useState } from 'react';
import { searchProducts } from '../services/api';

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const results = await searchProducts(query);
      onSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;