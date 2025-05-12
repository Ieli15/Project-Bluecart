import React from 'react';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover The Best Deals On All Popular Online Stores
          </h1>
          <p className="hero-subtitle">
            Millions Of Products Across Multiple Categories For All Shopping Needs
          </p>
          
          <div className="search-container">
            <SearchBar homepage={true} />
          </div>
        </div>
      </div>
      
      <div className="supported-sites-section">
        <h2>Supported Sites</h2>
        <div className="site-logos">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="site-logo" />
          <img src="https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-inverted-primary-logo-bdc6ddd67862d9bb1f8c559e1bb50dd233112ac57b29cac2edcf17ed2e1fe6fa.svg" alt="Shopify" className="site-logo" />
          <img src="data:image/png;base64,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" alt="Alibaba" className="site-logo" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="site-logo" />
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Choose BlueCart</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-balance-scale"></i>
            </div>
            <h3>Advanced MB/CB Analysis</h3>
            <p>Our proprietary algorithm analyzes Marginal Benefit and Cost Benefit to find the best value products.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search-dollar"></i>
            </div>
            <h3>Multi-store Search</h3>
            <p>Search and compare products across all major e-commerce platforms in one place.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shipping-fast"></i>
            </div>
            <h3>Total Cost Calculation</h3>
            <p>We include shipping costs in our comparison to show you the true final price.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-history"></i>
            </div>
            <h3>Search History</h3>
            <p>Save your searches and comparisons to revisit them later.</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to Find the Best Deals?</h2>
        <p>Create an account to save your searches and get personalized recommendations.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary btn-lg">Sign Up Free</Link>
          <Link to="/product" className="btn btn-outline-primary btn-lg">Start Searching</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
