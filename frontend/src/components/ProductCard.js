import React from 'react';

const ProductCard = ({ product, onCompare }) => {
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Format MB/CB 
  const formatScore = (score) => {
    return score ? score.toFixed(1) : 'N/A';
  };

  return (
    <div className="product-card">
      <div className="card">
        <div className="store-badge">{product.store}</div>
        
        <div className="card-img-container">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              className="card-img-top" 
              alt={product.title} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
              }}
            />
          ) : (
            <div className="no-image-placeholder">
              <i className="fas fa-image"></i>
              <span>No Image</span>
            </div>
          )}
        </div>
        
        <div className="card-body">
          <h5 className="card-title" title={product.title}>
            {product.title.length > 60 
              ? `${product.title.substring(0, 60)}...` 
              : product.title}
          </h5>
          
          <div className="product-price-rating">
            <div className="price">{formatPrice(product.price)}</div>
            
            <div className="rating">
              <span className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i}
                    className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                  ></i>
                ))}
              </span>
              <span className="rating-value">({product.rating})</span>
            </div>
          </div>
          
          <div className="product-shipping">
            <span className="shipping-label">Shipping:</span>
            <span className="shipping-value">
              {product.shipping_cost === 0 
                ? 'Free' 
                : formatPrice(product.shipping_cost)}
            </span>
          </div>
          
          <div className="score-container">
            <div className="score mb-score">
              <span className="score-label">MB Score:</span>
              <span className="score-value">{formatScore(product.mb_score)}</span>
            </div>
            <div className="score cb-score">
              <span className="score-label">CB Score:</span>
              <span className="score-value">{formatScore(product.cb_score)}</span>
            </div>
          </div>
          
          <div className="card-actions">
            <a 
              href={product.url} 
              className="btn btn-primary view-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Product
            </a>
            
            <button 
              className="btn btn-outline-primary compare-btn"
              onClick={() => onCompare(product)}
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
