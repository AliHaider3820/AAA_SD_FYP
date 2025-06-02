import React, { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef(null);
  const overlayRef = useRef(null);
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMobileMenu();
  };

  React.useEffect(() => {
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
  }, [isMobileMenuOpen]);

  return (
    <header className="header">
      <nav className="main-nav">
        <div className="top-nav">
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <picture className="logo-picture">
                <source srcSet={`${process.env.PUBLIC_URL}/AAA.jpeg`} type="image/jpeg" />
                <img src={`${process.env.PUBLIC_URL}/AAA.jpeg`} alt="AAA Logo" className="logo-img" loading="eager" />
              </picture>
            </Link>
          </div>

          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            {isAuthenticated ? (
              <>
                <span className="user-name">Welcome, {user?.username}</span>
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Login</Link>
            )}
          </div>

          {/* Hamburger Menu Button */}
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

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileNavRef}>
          <div className="mobile-menu">
            <div className="mobile-nav-header">
              <button className="close-btn" onClick={closeMobileMenu}>×</button>
            </div>
            <nav className="mobile-nav-links">
              <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>Home</Link>
              <Link to="/services" className="mobile-nav-link" onClick={closeMobileMenu}>Services</Link>
              <Link to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>About Us</Link>
              <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>
              {isAuthenticated ? (
                <>
                  <span className="user-name">Welcome, {user?.username}</span>
                  <button onClick={handleLogout} className="mobile-nav-link logout-btn">Logout</button>
                </>
              ) : (
                <Link to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>Login</Link>
              )}
            </nav>
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
