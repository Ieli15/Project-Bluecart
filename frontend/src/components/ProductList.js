import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ComparisonTable from './ComparisonTable';
import FilterPanel from './FilterPanel';
import { searchProducts, compareProducts } from '../services/api';

const ProductList = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const response = await searchProducts(filters.query, filters);
        setFilteredProducts(response.results);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      }
    };

    if (filters.query) {
      fetchFilteredProducts();
    }
  }, [filters]);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        const response = await compareProducts(products);
        setFilteredProducts(response.products);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      }
    };

    if (products && products.length > 0) {
      fetchComparisonData();
    }
  }, [products]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handle adding product to comparison
  const handleAddToCompare = (product) => {
    // Check if product is already in comparison
    if (selectedProducts.some(p => p.title === product.title && p.store === product.store)) {
      // Remove from comparison if already there
      setSelectedProducts(selectedProducts.filter(
        p => !(p.title === product.title && p.store === product.store)
      ));
    } else {
      // Add to comparison if not there (limit to 4 products)
      if (selectedProducts.length < 4) {
        setSelectedProducts([...selectedProducts, product]);
      } else {
        alert('You can compare up to 4 products at once');
      }
    }
  };

  // Clear comparison
  const handleClearComparison = () => {
    setSelectedProducts([]);
    setShowComparison(false);
  };

  // Show comparison table
  const handleShowComparison = () => {
    if (selectedProducts.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    setShowComparison(true);
  };

  // Hide comparison table
  const handleHideComparison = () => {
    setShowComparison(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="product-list-container">
      <FilterPanel products={products} onFilterChange={handleFilterChange} />
      {selectedProducts.length > 0 && (
        <div className="comparison-controls">
          <div className="selected-count">
            {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected
          </div>
          <div className="comparison-buttons">
            <button 
              className="btn btn-primary compare-selected-btn"
              onClick={handleShowComparison}
              disabled={selectedProducts.length < 2}
            >
              Compare Selected
            </button>
            <button
              className="btn btn-outline-secondary clear-selected-btn"
              onClick={handleClearComparison}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
      
      {showComparison && (
        <ComparisonTable 
          products={selectedProducts}
          onClose={handleHideComparison}
        />
      )}
      
      <div className="products-grid">
        {currentProducts.length === 0 ? (
          <div className="no-products">
            <i className="fas fa-search"></i>
            <p>No products found. Try a different search.</p>
          </div>
        ) : (
          currentProducts.map((product, index) => (
            <ProductCard 
              key={`${product.title}-${product.store}-${index}`}
              product={product}
              onCompare={handleAddToCompare}
              isSelected={selectedProducts.some(
                p => p.title === product.title && p.store === product.store
              )}
            />
          ))
        )}
      </div>
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
