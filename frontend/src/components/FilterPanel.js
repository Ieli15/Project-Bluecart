import React, { useState, useEffect } from 'react';

const FilterPanel = ({ products, onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    stores: [],
    rating: 0
  });
  
  const [storeOptions, setStoreOptions] = useState([]);
  const [expanded, setExpanded] = useState(true);
  
  // Extract all available stores from products
  useEffect(() => {
    if (products && products.length > 0) {
      const stores = [...new Set(products.map(product => product.store))];
      setStoreOptions(stores);
      
      // Initialize store filters to include all stores
      setFilters(prev => ({
        ...prev,
        stores: stores
      }));
      
      
      // Find max price for the range
      const maxPrice = Math.max(...products.map(product => product.price || 0)) + 100;
      setFilters(prev => ({
        ...prev,
        priceRange: [0, maxPrice]
      }));
    }
  }, [products]);
  
  // Handle price range change
  const handlePriceChange = (e, index) => {
    const value = parseFloat(e.target.value);
    const newRange = [...filters.priceRange];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }
    
    setFilters({
      ...filters,
      priceRange: newRange
    });
  };
  
  // Handle store filter change
  const handleStoreChange = (store) => {
    setFilters((prev) => {
      const updatedStores = prev.stores.includes(store)
        ? prev.stores.filter((s) => s !== store)
        : [...prev.stores, store];
      onFilterChange({ stores: updatedStores });
      return { ...prev, stores: updatedStores };
    });
  };
  
  // Handle rating filter change
  const handleRatingChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters({
      ...filters,
      rating: value
    });
  };
  
  // Apply filters
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  // Toggle panel expansion
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleFilterChange = () => {
    onFilterChange(filters);
  };
  
  return (
    <div className={`filter-panel ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="filter-header" onClick={toggleExpand}>
        <h4>
          <i className="fas fa-filter"></i> Filter
        </h4>
        <button className="expand-toggle">
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
        </button>
      </div>
      
      {expanded && (
        <div className="filter-content">
          {/* Price Range Filter */}
          <div className="filter-section">
            <h5>Price Range</h5>
            <div className="price-inputs">
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control min-price"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  min="0"
                />
              </div>
              <span className="price-separator">to</span>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control max-price"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  min={filters.priceRange[0]}
                />
              </div>
            </div>
          </div>
          
          {/* Stores Filter */}
          <div className="filter-section">
            <h5>Stores</h5>
            <div className="store-options">
              {storeOptions.map(store => (
                <div className="form-check" key={store}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`store-${store}`}
                    checked={filters.stores.includes(store)}
                    onChange={() => handleStoreChange(store)}
                  />
                  <label className="form-check-label" htmlFor={`store-${store}`}>
                    {store}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Rating Filter */}
          <div className="filter-section">
            <h5>Minimum Rating</h5>
            <div className="rating-slider">
              <input
                type="range"
                className="form-range"
                min="0"
                max="5"
                step="1"
                value={filters.rating}
                onChange={handleRatingChange}
              />
              <div className="rating-value">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i}
                    className={`fas fa-star ${i < filters.rating ? 'filled' : ''}`}
                  ></i>
                ))}
              </div>
            </div>
          </div>
          
          {/* Reset Filters Button */}
          <button
            className="btn btn-outline-secondary reset-filters-btn"
            onClick={() => {
              setFilters({
                priceRange: [0, Math.max(...products.map(product => product.price || 0)) + 100],
                stores: [...new Set(products.map(product => product.store))],
                rating: 0
              });
            }}
          >
            Reset Filters
          </button>

          {/* Apply Filters Button */}
          <button onClick={handleFilterChange}>Apply Filters</button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
