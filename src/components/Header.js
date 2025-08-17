import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import BusinessDropdown from './BusinessDropdown';
import './Header.css';
import './BusinessDropdown.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const mobileNavRef = useRef(null);
  const profileRef = useRef(null);
  const overlayRef = useRef(null);
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  const location = useLocation();
  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    const success = logout();
    setShowProfileDropdown(false);
    closeMobileMenu();
    
    if (success) {
      // Use React Router's navigate instead of window.location
      navigate('/', { replace: true });
    }
  };

  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target) && !event.target.closest('.hamburger-btn')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMobileMenu]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <header className="header">
      <nav className="main-nav">
        <div className="header-container">
          {/* Logo on the left */}
          <div className="logo-container">
            <Link to="/" className="logo-link" onClick={closeMobileMenu}>
              <img 
                src={process.env.PUBLIC_URL + '/favicon_transbg.png'} 
                alt="AAA Logo" 
                className="logo-img" 
                loading="eager"
                style={{
                  height: '50px',
                  width: 'auto',
                  maxWidth: '200px',
                  display: 'block'
                }}
                onError={(e) => {
                  console.log('Failed to load logo from:', e.target.src);
                  // Fallback to a different path if needed
                  e.target.src = '/favicon_darkbg.png';
                }}
              />
            </Link>
          </div>

          {/* Navigation links in center */}
          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
            <Link to="/services" className="nav-link" onClick={closeMobileMenu}>Services</Link>
            <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About Us</Link>
            <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link>
          </div>

          {/* Right side - profile and hamburger */}
          <div className="header-right">
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <BusinessDropdown 
                isAuthenticated={isAuthenticated} 
                user={user} 
                onLogout={handleLogout}
                isMobile={false}
              />
              <Link to="/reviews" className="nav-link" id="nav-link2">Write a Review</Link>
              <Link to="/complaint" className="nav-link"id="nav-link2">File a Complaint</Link>
            </div>
            
            {isAuthenticated ? (
              !user?.isServiceProvider && (
                <div className="profile-container" ref={profileRef}>
                  <button 
                    className="profile-btn" 
                    onClick={toggleProfileDropdown}
                    aria-expanded={showProfileDropdown}
                    aria-label="Profile menu"
                  >
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="profile-pic"
                      />
                    ) : (
                      <FaUserCircle className="profile-icon" />
                    )}
                    <span className="profile-name">My Profile</span>
                  </button>
                  
                  {showProfileDropdown && (
                    <div className="dropdown-menu">
                      <Link 
                        to="/profile" 
                        className="dropdown-item" 
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <FaUserCircle /> My Profile
                      </Link>
                      <button 
                        className="dropdown-item" 
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn" onClick={closeMobileMenu}>Login</Link>
                <Link to="/signup" className="signup-btn" onClick={closeMobileMenu}>Sign Up</Link>
              </div>
            )}
            <div className="hamburger-menu">
              <button
                className={`hamburger-btn ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile navigation"
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileNavRef}>
          <div className="mobile-menu">
            <div className="mobile-nav-header">
              <div className="logo-container">
                <Link to="/" className="logo-link" onClick={closeMobileMenu}>
                  <picture className="logo-picture">
                    <source srcSet={`${process.env.PUBLIC_URL}/favicon_transbg.png`} type="/png" />
                    <img src={`${process.env.PUBLIC_URL}/favicon_transbg.png`} alt="AAA Logo" className="logo-img" loading="eager" />
                  </picture>
                </Link>
              </div>
              <button className="close-btn" onClick={closeMobileMenu}>
                ×
              </button>
            </div>
            <div className="mobile-nav-links">
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
              <Link to="/services" className="nav-link" onClick={closeMobileMenu}>Services</Link>
              <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About Us</Link>
              <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link>
              
              {/* Moved links for mobile */}
              <Link to="/reviews" className="nav-link" onClick={closeMobileMenu}>Write a Review</Link>
              <Link to="/complaint" className="nav-link" onClick={closeMobileMenu}>File a Complaint</Link>
              
              {/* Always show BusinessDropdown in mobile menu */}
              <BusinessDropdown 
                isAuthenticated={isAuthenticated} 
                user={user} 
                onLogout={handleLogout}
                isMobile={true}
                closeMobileMenu={closeMobileMenu}
              />
              
              {isAuthenticated ? (
                <div className="profile-mobile-options">
                  <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>
                    <FaUserCircle className="mobile-nav-icon" /> My Profile
                  </Link>
                  <button onClick={handleLogout} className="nav-link">
                    <FaSignOutAlt className="mobile-nav-icon" /> Logout
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
                  <Link to="/signup" className="nav-link" onClick={closeMobileMenu}>Sign Up Free</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add overlay */}
      <div
        ref={overlayRef}
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />
    </header>
  );
};

export default Header;
