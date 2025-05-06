import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import FilterPanel from '../components/FilterPanel';
import '../styles/Product.css';

const Product = () => {
  const { searchResults, isLoading, searchQuery } = useSearch();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('bestValue');
  
  // Apply filters to the search results
  const handleFilterChange = (filters) => {
    if (!searchResults) return;
    
    const filtered = searchResults.filter(product => {
      // Apply price filter
      const price = parseFloat(product.price) || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }
      
      // Apply store filter
      if (!filters.stores.includes(product.store)) {
        return false;
      }
      
      // Apply rating filter
      const rating = parseFloat(product.rating) || 0;
      if (rating < filters.rating) {
        return false;
      }
      
      return true;
    });
    
    // Apply sorting
    const sorted = sortProducts(filtered, sortOption);
    setFilteredProducts(sorted);
  };
  
  // Sort products based on selected option
  const sortProducts = (products, option) => {
    const sortedProducts = [...products];
    
    switch (option) {
      case 'priceLow':
        sortedProducts.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'priceHigh':
        sortedProducts.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
        break;
      case 'mb':
        sortedProducts.sort((a, b) => (parseFloat(b.mb_score) || 0) - (parseFloat(a.mb_score) || 0));
        break;
      case 'cb':
        sortedProducts.sort((a, b) => (parseFloat(b.cb_score) || 0) - (parseFloat(a.cb_score) || 0));
        break;
      case 'bestValue':
      default:
        sortedProducts.sort((a, b) => {
          const scoreA = (parseFloat(a.mb_score) || 0) + (parseFloat(a.cb_score) || 0);
          const scoreB = (parseFloat(b.mb_score) || 0) + (parseFloat(b.cb_score) || 0);
          return scoreB - scoreA;
        });
        break;
    }
    
    return sortedProducts;
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    setFilteredProducts(sortProducts(filteredProducts, option));
  };
  
  // Update filtered products when search results change
  useEffect(() => {
    if (searchResults) {
      const sorted = sortProducts(searchResults, sortOption);
      setFilteredProducts(sorted);
    }
  }, [searchResults, sortOption]);

  return (
    <div className="product-page">
      <div className="product-header">
        <div className="container">
          <h1>Products</h1>
          <div className="search-container">
            <SearchBar />
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="row">
          {searchQuery && (
            <div className="search-info">
              <h2>
                Results for: <span className="search-query">"{searchQuery}"</span>
              </h2>
              <p className="result-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
          )}
          
          <div className="col-lg-3 filter-column">
            {searchResults && searchResults.length > 0 && (
              <FilterPanel 
                products={searchResults}
                onFilterChange={handleFilterChange}
              />
            )}
          </div>
          
          <div className="col-lg-9 product-results-column">
            {isLoading ? (
              <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Searching across multiple stores...</p>
              </div>
            ) : (
              <>
                {filteredProducts && filteredProducts.length > 0 ? (
                  <div className="product-controls">
                    <div className="sort-controls">
                      <label htmlFor="sort-select">Sort by:</label>
                      <select 
                        id="sort-select" 
                        className="form-select"
                        value={sortOption}
                        onChange={handleSortChange}
                      >
                        <option value="bestValue">Best Value</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="rating">Rating</option>
                        <option value="mb">MB Score</option>
                        <option value="cb">CB Score</option>
                      </select>
                    </div>
                  </div>
                ) : searchQuery ? (
                  <div className="no-results">
                    <i className="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try a different search term or adjust your filters.</p>
                  </div>
                ) : (
                  <div className="start-search">
                    <i className="fas fa-search"></i>
                    <h3>Search for products to get started</h3>
                    <p>Enter a product name, brand, or category in the search bar above.</p>
                  </div>
                )}
                
                {filteredProducts && filteredProducts.length > 0 && (
                  <ProductList products={filteredProducts} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
