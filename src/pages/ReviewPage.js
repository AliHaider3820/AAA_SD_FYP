import React, { useState, useEffect, useRef } from 'react';
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
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCategoryDropdown = (e) => {
    e.stopPropagation();
    setShowCategoryDropdown(prev => !prev);
  };
  
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
  
 
  const ratingMessages = {
    1: 'Not good',
    2: 'Could’ve been better',
    3: 'OK',
    4: 'Good',
    5: 'Great!'
  };
  
  const navigate = useNavigate();

  
  useEffect(() => {
    try {
    
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


  if (!reviewerName.trim()) {
    toast.error('Please enter your name.');
    return;
  }

  
  if (review.length < 45) {
    toast.error('Review must be at least 45 characters long.');
    return;
  }

 
  if (rating === 0) {
    toast.error('Please select a rating.');
    return;
  }

  
  if (!selectedProvider) {
    toast.error('Please select a service provider.');
    return;
  }

  setIsLoading(true);

  const reviewData = {
    reviewerName: reviewerName.trim(),
    providerId: selectedProvider.id || selectedProvider._id,
    providerName: selectedProvider.name,
    providerImage: selectedProvider.image,
    providerCategory: serviceCategories[selectedCategory] || 'General',
    rating,
    comment: review
  };

  try {
    const res = await fetch('http://localhost:5000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', 
      body: JSON.stringify(reviewData)
    });

    const data = await res.json();

    if (res.status === 401) {
      toast.error('Please log in to submit a review.');
      setTimeout(() => {
        window.location.href = '/login'; 
      }, 1500);
      return;
    }

    if (res.ok) {
      toast.success(data.message || '✅ Review submitted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light'
      });

     
      setRating(0);
      setReviewerName('');
      setReview('');
      setSelectedProvider(null);
    } else {
      toast.error(data.message || '❌ Failed to submit review.');
    }
  } catch (err) {
    console.error('Error submitting review:', err);
    toast.error('❌ An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};




  return (
    <div className="review-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      
      <div className="review-container">
        <h1>Rate & Review</h1>
        <p className="subtitle">Share your experience with our service providers</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="review-form">
       
          <div className="form-group">
            <label>Select Service Category</label>
            <div className="dropdown" ref={dropdownRef}>
              <div 
                className="dropdown-toggle form-control" 
                onClick={toggleCategoryDropdown}
              >
                {selectedCategory ? serviceCategories[selectedCategory] : 'Select a category'}
                <span className={`dropdown-arrow ${showCategoryDropdown ? 'open' : ''}`}>▼</span>
              </div>
              {showCategoryDropdown && (
                <div className="dropdown-menu show">
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
            <div className="rating">
              <p className="rating-message">{rating > 0 ? ratingMessages[rating] : 'Rate this provider'}</p>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => {
                
                  const currentRating = hover || rating;
                  let starColor = '#e4e5e9'; 
                  
                  if (star <= currentRating) {
                    if (currentRating <= 2) {
                      starColor = '#ff4444'; 
                    } else if (currentRating === 3) {
                      starColor = '#f4ec07'; 
                    } else {
                      starColor = '#f9b90b'; 
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
