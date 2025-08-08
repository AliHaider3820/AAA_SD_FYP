import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './ReviewPage.css';

const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [serviceProviders, setServiceProviders] = useState({});
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProviderList, setShowProviderList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  
  // Service categories mapping
  const serviceCategories = {
    1: 'Plumbing Services',
    2: 'Electrical Work',
    3: 'Food Catering',
    4: 'Home Painting',
    5: 'Transport Services',
    6: 'Home Cleaning',
    7: 'Gardening & Lawn',
    8: 'Home Repair',
    9: 'Locksmith Services',
    10: 'Online Courses',
    11: 'Food Delivery'
  };
  
  // Rating messages based on the selected rating
  const ratingMessages = {
    1: 'Not good',
    2: 'Could’ve been better',
    3: 'OK',
    4: 'Good',
    5: 'Great!'
  };
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Get service providers from shared data
  useEffect(() => {
    try {
      // Import service providers from the shared data file
      import('../data/serviceProviders').then(module => {
        const providersData = module.default;
        setServiceProviders(providersData);
      }).catch(err => {
        console.error('Error loading service providers:', err);
        setError('Failed to load service providers. Please try again later.');
      });
    } catch (err) {
      setError('Failed to load service providers. Please try again later.');
      console.error('Error loading service providers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Filter providers based on search query
  useEffect(() => {
    if (selectedCategory && serviceProviders[selectedCategory]) {
      const filtered = serviceProviders[selectedCategory].filter(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProviders(filtered);
    }
  }, [selectedCategory, searchQuery, serviceProviders]);
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedProvider(null);
    setShowCategoryDropdown(false);
    setShowProviderList(true);
    setSearchQuery('');
  };
  
  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setShowProviderList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCategory) {
      setError('Please select a service category');
      return;
    }

    if (!selectedProvider) {
      setError('Please select a service provider');
      return;
    }

    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }

    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    try {
      // Here you would typically send the review to your backend
      // For now, we'll just show a success message
      setSuccess('Thank you for your review!');
      toast.success('Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setReview('');
      setSelectedCategory('');
      setSelectedProvider(null);
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
      toast.error('Failed to submit review');
    }
  };

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
  };

  return (
    <div className="review-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      
      <div className="review-container">
        <h1>Write a Review</h1>
        <p className="subtitle">Share your experience with our service providers</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="review-form">
          {/* Category Selection */}
          <div className="form-group">
            <label>Select Service Category</label>
            <div className="dropdown">
              <div 
                className="dropdown-toggle form-control" 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                {selectedCategory ? serviceCategories[selectedCategory] : 'Select a category'}
                <span className="dropdown-arrow">▼</span>
              </div>
              {showCategoryDropdown && (
                <div className="dropdown-menu">
                  {Object.entries(serviceCategories).map(([id, name]) => (
                    <div 
                      key={id} 
                      className="dropdown-item"
                      onClick={() => handleCategorySelect(id)}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Provider Selection */}
          {selectedCategory && (
            <div className="form-group">
              <label>Select Service Provider</label>
              <div className="provider-search">
                <input
                  type="text"
                  placeholder="Search providers..."
                  className="form-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowProviderList(true)}
                />
                {showProviderList && (
                  <div className="provider-list">
                    {filteredProviders.length > 0 ? (
                      filteredProviders.map((provider) => (
                        <div 
                          key={provider.id} 
                          className="provider-item"
                          onClick={() => handleProviderSelect(provider)}
                        >
                          <img 
                            src={provider.image} 
                            alt={provider.name} 
                            className="provider-image1"
                          />
                          <div className="provider-info">
                            <div className="provider-name">{provider.name}</div>
                            <div className="provider-rating">
                              <FaStar color="#f9b90b" />
                              <span>{provider.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-results">No providers found</div>
                    )}
                  </div>
                )}
              </div>
              
              {selectedProvider && (
                <div className="selected-provider">
                  <div className="selected-provider-content">
                    <img 
                      src={selectedProvider.image} 
                      alt={selectedProvider.name}
                      className="selected-provider-image"
                    />
                    <div className="selected-provider-info">
                      <h4>{selectedProvider.name}</h4>
                      <div className="provider-rating">
                        <FaStar color="#f9b90b" />
                        <span>{selectedProvider.rating} ({selectedProvider.views} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="change-provider"
                    onClick={() => setShowProviderList(true)}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="reviewerName">Your Name</label>
            <input
              type="text"
              id="reviewerName"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Your Rating</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => {
                // Determine star color based on the current rating (or hover state)
                const currentRating = hover || rating;
                let starColor = '#e4e5e9'; // Default gray
                
                if (star <= currentRating) {
                  if (currentRating <= 2) {
                    starColor = '#ff4444'; // Red for 1-2 stars
                  } else if (currentRating === 3) {
                    starColor = '#f4ec07'; // Yellow for 3 stars
                  } else {
                    starColor = '#f9b90b'; // Gold for 4-5 stars
                  }
                }
                
                return (
                  <FaStar
                    key={star}
                    className="star"
                    color={starColor}
                    size={32}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="review">Your Review (min. 45 characters)</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="form-control"
              rows="6"
              minLength="45"
              required
              placeholder="Share your experience with this service provider. Be specific about what you liked or didn't like."
            />
            <div className="character-count">{review.length}/45 characters minimum</div>
          </div>
          
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
