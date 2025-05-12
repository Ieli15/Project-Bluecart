import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onCompare }) => {
  if (!product) {
    return <div>No product data available</div>;
  }

  console.log('Product data:', product);

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Format MB/CB scores
  const formatScore = (score) => {
    return score ? score.toFixed(1) : 'N/A';
  };

  const platformLogos = {
    Amazon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    eBay: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
    Walmart: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Walmart_logo.svg',
    Samsung: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    Apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  };

  return (
    <div className="product-card">
      <div className="card">
        <div className="store-badge">
          {platformLogos[product.platform] ? (
            <img 
              src={platformLogos[product.platform]} 
              alt={product.platform} 
              className="platform-logo"
              style={{ width: '50px', height: 'auto' }}
            />
          ) : (
            product.platform || 'Unknown Store'
          )}
        </div>
        
        <div className="card-img-container">
          {product.image_url ? (
            <>
              {console.log('Image URL before rendering:', product.image_url)}
              <img 
                src={product.image_url} 
                className="card-img-top" 
                alt={product.name || 'No Title'} 
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  if (e.target.src !== 'https://via.placeholder.com/150?text=No+Image') {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }
                }}
              />
            </>
          ) : (
            <div className="no-image-placeholder">
              <i className="fas fa-image"></i>
              <span>No Image</span>
            </div>
          )}
        </div>
        
        <div className="card-body">
          <h5 className="card-title" title={product.name || 'No Title'}>
            {product.name && product.name.length > 60 
              ? `${product.name.substring(0, 60)}...` 
              : product.name || 'No Title'}
          </h5>
          
          <div className="product-price-rating">
            <div className="price">{formatPrice(product.price || 0)}</div>
            
            <div className="rating">
              <span className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i}
                    className={`fas fa-star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
                  ></i>
                ))}
              </span>
              <span className="rating-value">({product.rating || 'N/A'})</span>
            </div>
          </div>
          
          <div className="product-delivery">
            <span className="delivery-label">Delivery Cost:</span>
            <span className="delivery-value">
              {product.delivery_cost === 0 
                ? 'Free' 
                : formatPrice(product.delivery_cost || 0)}
            </span>
          </div>
          <div className="product-payment-mode">
            <span className="payment-label">Payment Mode:</span>
            <span className="payment-value">
              {product.payment_mode || 'N/A'}
            </span>
          </div>
          
          <div className="score-container">
            <div className="score mb-score">
              <span className="score-label">MB Score:</span>
              <span className="score-value">
                {product.mb_score !== undefined ? product.mb_score.toFixed(6) : 'N/A'}
              </span>
            </div>
            <div className="score cb-score">
              <span className="score-label">CB Score:</span>
              <span className="score-value">
                {product.cb_score !== undefined ? product.cb_score.toFixed(6) : 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="card-actions">
            <Link 
              to={{ pathname: `/product-details/${product.id}`, state: { product } }}
              className="btn btn-primary view-btn"
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
