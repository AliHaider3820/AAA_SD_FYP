import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const mobileNavRef = useRef(null);
  const profileRef = useRef(null);
  const overlayRef = useRef(null);
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/');
    closeMobileMenu();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
  }, []);

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
  }, [isMobileMenuOpen]);

  return (
    <header className="header">
      <nav className="main-nav">
        <div className="top-nav">
          <div className="logo-container">
            <Link to="/" className="logo-link" onClick={closeMobileMenu}>
              <picture className="logo-picture">
                <source srcSet={`${process.env.PUBLIC_URL}/LOGO-AAA.jpeg`} type="image/jpeg" />
                <img src={`${process.env.PUBLIC_URL}/LOGO-AAA.jpeg`} alt="AAA Logo" className="logo-img" loading="eager" />
              </picture>
            </Link>
          </div>

          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
            <Link to="/services" className="nav-link" onClick={closeMobileMenu}>Services</Link>
            <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About Us</Link>
            <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link>
            
            {/* Always show auth buttons when not logged in */}
            {!isAuthenticated ? (
              <div className="auth-buttons">
                <Link to="/login" className="nav-link login-btn" onClick={closeMobileMenu}>Login</Link>
                <Link to="/signup" className="nav-link signup-btn" onClick={closeMobileMenu}>Sign Up Free</Link>
              </div>
            ) : (
              <div className="profile-container" ref={profileRef}>
                <button className="profile-button" onClick={toggleProfileDropdown}>
                  <div className="profile-avatar">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="profile-image" />
                    ) : (
                      <span className="profile-initials">{getUserInitials()}</span>
                    )}
                  </div>
                  <span className="profile-name">{user?.name?.split(' ')[0] || 'User'}</span>
                </button>
                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>
                      <FaUserCircle className="dropdown-icon" />
                      My Profile
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="dropdown-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
              <div className="logo-container">
                <Link to="/" className="logo-link" onClick={closeMobileMenu}>
                  <picture className="logo-picture">
                    <source srcSet={`${process.env.PUBLIC_URL}/AAA.jpeg`} type="image/jpeg" />
                    <img src={`${process.env.PUBLIC_URL}/AAA.jpeg`} alt="AAA Logo" className="logo-img" loading="eager" />
                  </picture>
                </Link>
              </div>
            </div>
            <div className="mobile-nav-links">
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
              <Link to="/services" className="nav-link" onClick={closeMobileMenu}>Services</Link>
              <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About Us</Link>
              <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>My Profile</Link>
                  <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                </>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="nav-link login-btn" onClick={closeMobileMenu}>Login</Link>
                  <Link to="/signup" className="nav-link signup-btn" onClick={closeMobileMenu}>Sign Up Free</Link>
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
