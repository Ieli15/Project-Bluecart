import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onCompare }) => {
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Format MB/CB scores
  const formatScore = (score) => {
    if (score === null || score === undefined) return 'N/A';
    return Number.isFinite(score) ? score.toFixed(1) : 'N/A';
  };

  return (
    <div className="product-card amazon-style">
      <div className="card">
        {/* Product name above image */}
        <div className="product-name-amazon">{product.name}</div>
        <div className="card-img-container">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              className="card-img-top product-image-amazon" 
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
          <div className="store-badge-amazon">{product.store}</div>
          <h5 className="card-title product-title-amazon" title={product.title}>
            {(product.title || '').length > 60 
              ? `${(product.title || '').substring(0, 60)}...` 
              : product.title}
          </h5>
          <div className="product-price-rating-amazon">
            <div className="price-amazon">{formatPrice(product.price)}</div>
            <div className="rating-amazon">
              <span className="stars-amazon">
                {[...Array(5)].map((_, i) => {
                  if (product.rating >= i + 1) {
                    return <i key={i} className="fas fa-star star-amazon filled"></i>;
                  } else if (product.rating > i && product.rating < i + 1) {
                    return <i key={i} className="fas fa-star-half-alt star-amazon filled"></i>;
                  } else {
                    return <i key={i} className="fas fa-star star-amazon"></i>;
                  }
                })}
              </span>
              <span className="rating-value-amazon">{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
          <div className="product-shipping-amazon">
            {product.delivery_cost === 0 || product.delivery_cost === '0' ? (
              <span className="shipping-free-amazon">FREE Shipping</span>
            ) : (
              <span className="shipping-cost-amazon">Shipping: {formatPrice(product.delivery_cost)}</span>
            )}
          </div>
          <div className="score-container-amazon">
            <div className="score mb-score">
              <span className="score-label">MB:</span>
              <span className="score-value">{formatScore(product.mb_score)}</span>
            </div>
            <div className="score cb-score">
              <span className="score-label">CB:</span>
              <span className="score-value">{formatScore(product.cb_score)}</span>
            </div>
          </div>
          <div className="card-actions-amazon">
            <Link 
              to={{
                pathname: `/product-details/${product.id}`,
              }}
              state={{ product }}
              className="btn btn-amazon view-btn-amazon"
            >
              View Product
            </Link>
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
