import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const SearchBar = ({ homepage = false }) => {
  const [query, setQuery] = useState('');
  const { setSearchResults, setIsLoading, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setSearchQuery(query);
    
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`http://localhost:8000/api/search?query=${encodeURIComponent(query)}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.results);
      
      // Navigate to product page if on homepage
      if (homepage) {
        navigate('/product');
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`search-bar ${homepage ? 'homepage-search' : ''}`}>
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={homepage ? "Search For Items And Products" : "Search here for your products ..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          {homepage && (
            <button className="btn btn-primary search-btn" type="submit">
              Search
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
