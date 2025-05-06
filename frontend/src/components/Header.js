import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <i className="fas fa-shopping-cart"></i>
              <span>Blue Cart</span>
            </Link>
          </div>
          
          <div className={`navigation ${menuOpen ? 'menu-open' : ''}`}>
            <nav className="main-nav">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/product">Product</Link>
                </li>
                {isAuthenticated && (
                  <>
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                      <Link to="/history">History</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
            
            <div className="auth-buttons">
              {isAuthenticated ? (
                <div className="authenticated-user">
                  <span className="username">{user?.username}</span>
                  <button 
                    className="btn btn-outline-primary logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary login-btn">Login</Link>
                  <Link to="/signup" className="btn btn-outline-primary signup-btn">Sign Up</Link>
                </>
              )}
            </div>
          </div>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
