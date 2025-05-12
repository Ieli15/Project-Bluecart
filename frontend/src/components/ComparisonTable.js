import React from 'react';

const ComparisonTable = ({ products, onClose }) => {
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  
  // Format scores
  const formatScore = (score) => {
    return score ? score.toFixed(1) : 'N/A';
  };
  
  // Calculate total cost (price + shipping)
  const calculateTotalCost = (product) => {
    const price = parseFloat(product.price) || 0;
    const shipping = parseFloat(product.shipping_cost) || 0;
    return price + shipping;
  };
  
  // Find the best product based on MB+CB score
  const findBestProduct = () => {
    if (!products || products.length === 0) return null;
    
    return products.reduce((best, current) => {
      const bestScore = (best.mb_score || 0) + (best.cb_score || 0);
      const currentScore = (current.mb_score || 0) + (current.cb_score || 0);
      return currentScore > bestScore ? current : best;
    }, products[0]);
  };
  
  const bestProduct = findBestProduct();

  return (
    <div className="comparison-table-overlay">
      <div className="comparison-table-container">
        <div className="comparison-header">
          <h3>Product Comparison</h3>
          <button 
            className="close-comparison-btn"
            onClick={onClose}
            aria-label="Close comparison"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="table-responsive">
          <table className="table table-striped comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                {products.map((product, index) => (
                  <th key={index} className={product === bestProduct ? 'best-value' : ''}>
                    {product === bestProduct && <div className="best-badge">Best Value</div>}
                    <div className="product-header">
                      <span className="store-name">{product.store}</span>
                      <img 
                        src={product.image_url || 'https://via.placeholder.com/50?text=No+Image'} 
                        alt={product.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                        }}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Product Name</td>
                {products.map((product, index) => (
                  <td key={index} className={product === bestProduct ? 'best-value' : ''}>
                    <a 
                      href={product.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="product-link"
                    >
                      {product.title}
                    </a>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Price</td>
                {products.map((product, index) => (
                  <td key={index} className={product === bestProduct ? 'best-value' : ''}>
                    {formatPrice(product.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Shipping Cost</td>
                {products.map((product, index) => (
                  <td key={index} className={product === bestProduct ? 'best-value' : ''}>
                    {product.shipping_cost === 0 ? 'Free' : formatPrice(product.shipping_cost)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Total Cost</td>
                {products.map((product, index) => (
                  <td key={index} className={product === bestProduct ? 'best-value' : ''}>
                    {formatPrice(calculateTotalCost(product))}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Rating</td>
                {products.map((product, index) => (
                  <td key={index} className={product === bestProduct ? 'best-value' : ''}>
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
                  </td>
                ))}
              </tr>
              <tr>
                <td>MB Score</td>
                {products.map((product, index) => (
                  <td key={index} className={product === bestProduct ? 'best-value' : ''}>
                    {formatScore(product.mb_score)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>CB Score</td>
                {products.map((product, index) => (
                  <td key={index} className={product === bestProduct ? 'best-value' : ''}>
                    {formatScore(product.cb_score)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Total Score</td>
                {products.map((product, index) => {
                  const totalScore = (product.mb_score || 0) + (product.cb_score || 0);
                  return (
                    <td key={index} className={product === bestProduct ? 'best-value highlight-score' : ''}>
                      {formatScore(totalScore)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="comparison-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
