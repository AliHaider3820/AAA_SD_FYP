import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa';
import { IoBusiness } from 'react-icons/io5';
import { MdDashboard } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';
import './BusinessDropdown.css';

const BusinessDropdown = ({ isAuthenticated, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user: authUser } = useContext(AuthContext);
  const [hasBusiness, setHasBusiness] = useState(false);

  useEffect(() => {
    const checkBusiness = () => {
      const currentUser = user || authUser;
      if (isAuthenticated && currentUser) {
        // Check if user has a business
        const providers = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
        const userBusiness = providers.find(p => p.userId === currentUser.id);
        setHasBusiness(!!userBusiness);
      }
    };
    
    checkBusiness();
  }, [isAuthenticated, user, authUser]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleItemClick = (path) => {
    closeDropdown();
    navigate(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="business-dropdown" ref={dropdownRef}>
      <button 
        className="business-dropdown-toggle" 
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        AAA For Business
      </button>
      
      {isOpen && (
        <div className="business-dropdown-menu">
          {isAuthenticated ? (
            <>
              {hasBusiness ? (
                <>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleItemClick('/business/dashboard')}
                  >
                    <MdDashboard className="dropdown-icon" />
                    Business Dashboard
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleItemClick('/business/profile')}
                  >
                    <FaStore className="dropdown-icon" />
                    My Business Profile
                  </button>
                </>
              ) : (
                <Link 
                  to="/service-provider-signup"
                  className="dropdown-item"
                  onClick={closeDropdown}
                >
                  <IoBusiness className="dropdown-icon" />
                  Register Your Business
                </Link>
              )}
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item"
                onClick={() => {
                  closeDropdown();
                  if (onLogout) {
                    onLogout();
                  }
                  // Clear user session
                  localStorage.removeItem('currentUser');
                  // Redirect to home page
                  navigate('/');
                  // Reload the page to update the UI
                  window.location.reload();
                }}
              >
                  <FaSignOutAlt className="dropdown-icon" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/business/login" 
                className="dropdown-item"
                onClick={closeDropdown}
              >
                <FaSignInAlt className="dropdown-icon" />
                Business Login
              </Link>
              <div className="dropdown-divider"></div>
              <Link 
                to="/service-provider-signup" 
                className="dropdown-item"
                onClick={closeDropdown}
              >
                <IoBusiness className="dropdown-icon" />
                Register Business
              </Link>
              <div className="dropdown-divider"></div>
             
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessDropdown;
