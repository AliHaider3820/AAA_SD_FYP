import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import serviceProviders from '../data/serviceProviders';
import './ProviderProfile.css';

// Mock reviews data structure
const mockReviews = {
  1: [
    { id: 1, name: 'Sarah Johnson', rating: 5, comment: 'Excellent service! The team was professional and completed the job efficiently. Highly recommend!', date: '2023-10-15' },
    { id: 2, name: 'Michael Chen', rating: 4, comment: 'Good work overall, but there was a slight delay in completing the project. The quality of work was great though.', date: '2023-10-10' },
  ],
  2: [
    { id: 3, name: 'Alex Turner', rating: 5, comment: 'Outstanding service! Will definitely hire again.', date: '2023-10-18' },
  ],
  // Add more reviews for other providers as needed
};

// Use the imported serviceProviders data
const mockProviders = serviceProviders;

const ProviderProfile = () => {
  const { serviceId, providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      // Ensure providerId is treated as a string for consistent comparison
      const providerIdStr = String(providerId);
      const serviceProviders = mockProviders[serviceId] || [];
      const selectedProvider = serviceProviders.find(p => p.id === parseInt(providerIdStr));
      
      if (selectedProvider) {
        setProvider(selectedProvider);
        
        // Load reviews from localStorage
        const savedReviews = localStorage.getItem('providerReviews');
        if (savedReviews) {
          try {
            const allReviews = JSON.parse(savedReviews);
            // Ensure we're using the same string key when accessing the reviews
            const providerReviews = allReviews[providerIdStr] || [];
            console.log('Loaded reviews:', providerReviews);
            setReviews(providerReviews);
          } catch (error) {
            console.error('Error parsing saved reviews:', error);
            setReviews([]);
          }
        } else {
          // Fallback to mock reviews if no localStorage data
          console.log('No saved reviews, using mock data');
          setReviews(mockReviews[providerIdStr] || []);
        }
      } else {
        console.log('Provider not found, redirecting...');
        navigate('/services');
      }
      setLoading(false);
    };
    
    fetchData();
  }, [serviceId, providerId, navigate]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Ensure providerId is treated as a string for consistent storage
      const providerIdStr = String(providerId);
      
      const review = {
        id: Date.now(),
        name: newReview.name.trim(),
        rating: parseInt(newReview.rating, 10),
        comment: newReview.comment.trim(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      // Get existing reviews from localStorage or initialize empty object
      const savedReviews = JSON.parse(localStorage.getItem('providerReviews') || '{}');
      
      // Add new review to the provider's reviews using the string key
      const providerReviews = savedReviews[providerIdStr] 
        ? [...savedReviews[providerIdStr], review] 
        : [review];
      
      // Save back to localStorage with the string key
      savedReviews[providerIdStr] = providerReviews;
      localStorage.setItem('providerReviews', JSON.stringify(savedReviews));
      
      console.log('Saved reviews:', savedReviews);
      
      // Update state
      setReviews(providerReviews);
      setNewReview({ name: '', rating: 5, comment: '' });
      setShowReviewForm(false);
      
      // Show success message
      alert('Thank you for your review!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again.');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!provider) {
    return <div className="error">Provider not found</div>;
  }

  return (
    <div className="provider-profile">
      <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'flex-start' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: '#4a6cf7',
            color: 'white',
            border: '2px solid #3a5bd9',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            minWidth: '160px',
            textAlign: 'center'
          }}
        >
          <span style={{ display: 'inline-block', width: '20px', textAlign: 'center' }}>←</span>
          <span>Back to Results</span>
        </button>
      </div>
      
      <div className="profile-header">
        <div className="profile-image-container">
          {provider.image ? (
            <img 
              src={provider.image} 
              alt={provider.name} 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
              }}
            />
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>
        
        <div className="profile-info">
          <h1>{provider.name}</h1>
          <div className="rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                const isFilled = i < Math.floor(provider.rating);
                const isHalfFilled = !isFilled && (provider.rating - i > 0.5);
                
                return (
                  <span key={i} className={`star ${isFilled ? 'filled' : ''} ${isHalfFilled ? 'half-filled' : ''}`}>
                    <i className="fas fa-star"></i>
                    {isHalfFilled && <i className="fas fa-star-half-alt half-star"></i>}
                  </span>
                );
              })}
            </div>
            <span className="rating-text">
              <strong>{provider.rating.toFixed(1)}</strong> 
              <span className="divider">•</span> 
              <span className="review-count">{Math.floor(provider.rating * 10)} reviews</span>
            </span>
          </div>
          
          <div className="experience">
            <i className="fas fa-briefcase"></i>
            <span>{provider.experience} of experience</span>
          </div>
          
          <div className="location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{provider.location}</span>
          </div>
          
          <div className="phone">
            <i className="fas fa-phone"></i>
            <a href={`tel:${provider.phone}`}>{provider.phone}</a>
          </div>
          
          <button className="contact-button">
            <i className="fas fa-envelope"></i> Contact Provider
          </button>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="description">
          <h2>About {provider.name}</h2>
          <p>{provider.description}</p>
        </div>
        
        <div className="services-section">
          <h3>Services Offered</h3>
          {provider.services && provider.services.length > 0 ? (
            <ul className="services-list">
              {provider.services.map((service, index) => (
                <li key={index}>
                  <i className="fas fa-check-circle"></i>
                  {service}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-services">No specific services listed for this provider.</p>
          )}
        </div>
        
        <div className="reviews-section">
          <div className="reviews-header">
            <h3>Customer Reviews</h3>
            <button 
              className="add-review-btn" 
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
          
          {showReviewForm && (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h4>Write a Review</h4>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newReview.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Rating</label>
                <div className="rating-input">
                  <div className="stars-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <React.Fragment key={star}>
                        <input
                          type="radio"
                          id={`star${star}`}
                          name="rating"
                          value={star}
                          checked={parseInt(newReview.rating) === star}
                          onChange={handleInputChange}
                        />
                        <label htmlFor={`star${star}`} className="star">
                          <i className={`fas fa-star ${star <= newReview.rating ? 'filled' : ''}`}></i>
                        </label>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="rating-value">
                    {newReview.rating ? `You rated: ${newReview.rating} star${newReview.rating > 1 ? 's' : ''}` : 'Select a rating'}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="comment">Your Review</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  placeholder="Share your experience with this provider..."
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-review-btn">
                <i className="fas fa-paper-plane"></i> Submit Review
              </button>
            </form>
          )}
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review">
                  <div className="review-header">
                    <span className="reviewer">{review.name}</span>
                    <span className="review-date">{review.date}</span>
                    <span className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                          key={star} 
                          className={`fas fa-star ${star <= review.rating ? 'filled' : 'empty'}`}
                        ></i>
                      ))}
                    </span>
                  </div>
                  <p className="review-text">{review.comment}</p>
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

export default ProviderProfile;