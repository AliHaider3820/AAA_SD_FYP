import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBackspace, FaBackward, FaBuilding, FaSignInAlt, FaSignLanguage, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../App';
import './BusinessDropdown.css';
import { FaBabyCarriage, FaBackwardFast, FaBackwardStep } from 'react-icons/fa6';

const BusinessDropdown = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user: authUser } = useContext(AuthContext);
  const [hasBusiness, setHasBusiness] = useState(false);

  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Check if user has a business
      const providers = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
      const userBusiness = providers.find(p => p.userId === authUser.id);
      setHasBusiness(!!userBusiness);
    }
  }, [isAuthenticated, authUser]);

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
                <button 
                  className="dropdown-item"
                  onClick={() => handleItemClick('/business-profile')}
                >
                  <FaBuilding className="dropdown-icon" />
                  My Business Profile
                </button>
              ) : (
                <button 
                  className="dropdown-item"
                  onClick={() => handleItemClick('/service-provider-signup')}
                >
                  <FaBuilding className="dropdown-icon" />
                  Register Your Business
                </button>
              )}
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item"
                onClick={() => {
                  closeDropdown();
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
            <button 
              className="dropdown-item"
              onClick={() => handleItemClick('/login')}
            >
              <FaSignInAlt className="dropdown-icon" />
              Login / Register
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessDropdown;
