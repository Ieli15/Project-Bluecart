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
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg" alt="Shopee" className="site-logo" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Walmart_logo.svg" alt="Walmart" className="site-logo" />
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
