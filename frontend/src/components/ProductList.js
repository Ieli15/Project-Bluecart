import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ComparisonTable from './ComparisonTable';

const ProductList = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Handle adding product 
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

  return (
    <div className="product-list-container">
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
        {products.length === 0 ? (
          <div className="no-products">
            <i className="fas fa-search"></i>
            <p>No products found. Try a different search.</p>
          </div>
        ) : (
          products.map((product, index) => (
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
    </div>
  );
};

export default ProductList;
