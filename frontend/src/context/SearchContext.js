import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const SearchContext = createContext();

// Search provider component
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('searchQuery') || '';
  });
  const [searchResults, setSearchResults] = useState(() => {
    const stored = localStorage.getItem('searchResults');
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState([]);

  // Persist searchQuery and searchResults to localStorage
  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('searchResults', JSON.stringify(searchResults));
  }, [searchResults]);

  // Add product to comparison
  const addToComparison = (product) => {
    // Check if product is already in comparison
    if (comparisonProducts.some(p => p.title === product.title && p.store === product.store)) {
      return;
    }
    
    // Add product to comparison 
    if (comparisonProducts.length < 4) {
      setComparisonProducts([...comparisonProducts, product]);
    }
  };
  
  // Remove product from comparison
  const removeFromComparison = (product) => {
    setComparisonProducts(comparisonProducts.filter(
      p => !(p.title === product.title && p.store === product.store)
    ));
  };
  
  // Clear comparison
  const clearComparison = () => {
    setComparisonProducts([]);
  };
  
  // Context value
  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    comparisonProducts,
    addToComparison,
    removeFromComparison,
    clearComparison
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use search context
export const useSearch = () => {
  return useContext(SearchContext);
};
