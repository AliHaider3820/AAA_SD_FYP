import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaPhone, FaMapMarkerAlt, FaEnvelope, FaEdit } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './BusinessProfile.css';

const BusinessProfile = () => {
  const { businessId } = useParams();
  const { user } = useContext(AuthContext);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const providers = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
        
        // Find business by ID from URL
        let businessData = null;
        
        if (businessId) {
          businessData = providers.find(p => p.id === businessId);
        } else if (user) {
          // If no businessId provided, show the first business for the current user
          const userBusinesses = providers.filter(p => p.userId === user.id);
          businessData = userBusinesses[0];
        }

        if (businessData) {
          setBusiness(businessData);
        } else {
          setError('Business not found');
        }
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('Failed to load business information');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId, user?.id]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <Link to="/" className="back-link">Return to Home</Link>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="no-business">
        <h2>No business profile found</h2>
        <Link to="/service-provider-signup" className="btn-primary">
          {user ? 'Add a New Business' : 'Register Your Business'}
        </Link>
        {user && (
          <Link to="/" className="btn-secondary" style={{ marginLeft: '10px' }}>
            Back to Home
          </Link>
        )}
      </div>
    );
  }

  // Check if current user owns this business
  const isOwner = user && business.userId === user.id;

  return (
    <div className="business-profile">
      <div className="profile-header">
        <div className="business-avatar">
          {business.profilePicture ? (
            <img 
              src={business.profilePicture} 
              alt={business.businessName || 'Business'} 
              className="business-profile-image"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="avatar-placeholder" 
            style={{ display: business.profilePicture ? 'none' : 'flex' }}
          >
            {business.businessName ? business.businessName.charAt(0).toUpperCase() : 'B'}
          </div>
        </div>
        <div className="business-info">
          <div className="business-header">
            <h1>{business.businessName || 'My Business'}</h1>
            {isOwner && (
              <Link to={`/edit-business/${business.id}`} className="edit-btn">
                <FaEdit /> Edit Profile
              </Link>
            )}
          </div>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={i < Math.floor(business.rating) ? 'star filled' : 'star'} 
              />
            ))}
            <span className="rating-text">
              {business.rating.toFixed(1)} ({business.reviews?.length || 0} reviews)
            </span>
          </div>
          <p className="category">{business.categoryName || 'Service Provider'}</p>
          {business.yearsOfExperience && (
            <p className="experience">{business.yearsOfExperience} year{business.yearsOfExperience !== '1' ? 's' : ''} of experience</p>
          )}
        </div>
      </div>

      <div className="business-details">
        <div className="detail-card">
          <h3>Contact Information</h3>
          <div className="detail-item">
            <FaPhone className="detail-icon" />
            <span>{business.phone || 'Not provided'}</span>
          </div>
          <div className="detail-item">
            <FaEnvelope className="detail-icon" />
            <span>{business.email}</span>
          </div>
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>
              {[business.address, business.location, business.city]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        </div>

        <div className="description-card">
          <h3>About Us</h3>
          <p>{business.description || 'No description provided.'}</p>
        </div>

        <div className="reviews-card">
          <div className="reviews-header">
            <h3>Customer Reviews</h3>
            <Link to={`/add-review/${business.id}`} className="btn-secondary">
              Write a Review
            </Link>
          </div>
          
          {business.reviews?.length > 0 ? (
            <div className="reviews-list">
              {business.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="reviewer">{review.userName || 'Anonymous'}</span>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < review.rating ? 'star filled' : 'star'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.comment}</p>
                  <span className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
