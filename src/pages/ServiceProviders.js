
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import serviceProviders from '../data/serviceProviders';
import './ServiceProviders.css';

const ServiceProviders = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceTitle, setServiceTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('reviews'); // Default sort by reviews
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Sort function for providers
  const sortProviders = (providers, option) => {
    if (!providers || !providers.length) return [];
    
    return [...providers].sort((a, b) => {
      switch(option) {
        case 'reviews':
          return (b.reviews || 0) - (a.reviews || 0);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'newest':
          return (b.id || 0) - (a.id || 0);
        case 'oldest':
          return (a.id || 0) - (b.id || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  };
  
  // Update filtered and sorted providers when search term, providers, or sort option changes
  useEffect(() => {
    let result = [...providers];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(provider =>
        provider.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (provider.name && provider.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sorting
    result = sortProviders(result, sortOption);
    
    setFilteredProviders(result);
  }, [searchTerm, providers, sortOption]);


  // Get service title based on ID
  const getServiceTitle = (id) => {
    const serviceTitles = {
      1: "Plumbing Services",
      2: "Electrical Work",
      3: "Food Catering",
      4: "Home Cleaning",
      5: "Transport Services",
      6: "Home Maintenance",
      7: "Gardening & Lawn",
      8: "Pest Control",
      9: "Locksmith Services",
      10: "Moving & Storage",
      11: "Food Delivery",
      12: "Personal Training"
    };
    return serviceTitles[id] || 'Service Providers';
  };

  // Set the service title based on the serviceId
  useEffect(() => {
    setServiceTitle(getServiceTitle(parseInt(serviceId)));
  }, [serviceId]);

  // Fetch providers from the imported data
  useEffect(() => {
    const fetchProviders = () => {
      // Use the imported serviceProviders data
      const mockServiceProviders = serviceProviders[serviceId] || [];
      
      // Get registered providers from localStorage
      try {
        const registeredProviders = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
        
        // Filter providers for the current service category
        const filteredRegisteredProviders = registeredProviders.filter(
          provider => parseInt(provider.serviceCategory) === parseInt(serviceId)
        );
        
        // Combine and deduplicate providers by ID
        const combinedProviders = [
          ...mockServiceProviders,
          ...filteredRegisteredProviders.filter(
            registered => !mockServiceProviders.some(mock => mock.id === registered.id)
          )
        ];
        
        console.log('Combined providers:', combinedProviders);
        setProviders(combinedProviders);
      } catch (error) {
        console.error('Error loading registered providers:', error);
        setProviders(mockServiceProviders);
      }
      
      setLoading(false);
    };
    
    fetchProviders();
  }, [serviceId, location.state]);

  const handleProviderClick = (provider, e) => {
    // Prevent navigation if the click was on a button or link inside the card
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'A' || e.target.closest('a')) {
      return;
    }
    // Navigate to provider profile with both serviceId and providerId
    navigate(`/provider/${serviceId}/${provider.id}`);
  };

  if (loading) {
    return <div className="loading">Loading providers...</div>;
  }

  return (
    <div className="service-providers-container">
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
          <span>Back to Services</span>
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2rem', margin: 0 }}>
          {serviceTitle} Providers
        </h1>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', minWidth: '200px', flex: '1' }}>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <option value="reviews">Sort by: Most Reviews</option>
              <option value="rating">Sort by: Highest Rating</option>
              <option value="alphabetical">Sort by: A-Z</option>
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
          </div>
          <div style={{ position: 'relative', minWidth: '250px', flex: '1' }}>
          <input
            type="text"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              paddingLeft: '40px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          />
          <i className="fas fa-search" style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666'
          }}></i>
          </div>
        </div>
      </div>
      
      {filteredProviders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
          <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }}></i>
          <h3>No providers found in "{searchTerm}"</h3>
          <p>Try a different location or check back later for more providers in your area.</p>
        </div>
      ) : (
        <div className="providers-grid">
        {filteredProviders.map((provider) => (
          <div 
            key={provider.id} 
            className="provider-card" 
            onClick={(e) => handleProviderClick(provider, e)}
            style={{ cursor: 'pointer' }}
            tabIndex={0}
            role="button"
            aria-label={`View ${provider.name}'s profile`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleProviderClick(provider, e);
              }
            }}
          >
            <div className="provider-image-container">
              <div className="image-container">
                <img 
                  src={provider.profilePicture || provider.image || 'https://placehold.co/150x150?text=No+Image'} 
                  alt={provider.name} 
                  className="profile-image hover-zoom"
                  onError={(e) => {
                    // Fallback to a placeholder if the image fails to load
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/150x150?text=No+Image';
                  }}
                />
              </div>
            </div>
            <div className="provider-info">
              <h3>{provider.name}</h3>
              <div className="provider-stats">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas fa-star ${i < Math.floor(provider.rating) ? 'filled' : ''}`}
                      ></i>
                    ))}
                    {provider.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                    <span className="rating-number">({provider.rating})</span>
                  </span>
                </div>
                  <span className="views">({provider.views?.toLocaleString() || '0'}) views</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="experience">{provider.experience} experience</span>
                  <span className="review-count" style={{ color: '#666', fontSize: '0.9rem' }}>
                  <i className="fas fa-comment-alt" style={{ marginRight: '10px' }}></i>
                  {provider.reviews?.toLocaleString() || '0'} reviews
                  </span>
                </div>
              </div>
              <p className="location">
                <i className="fas fa-map-marker-alt"></i> {provider.location}
              </p>
              <p className="description">{provider.description}</p>
              <div className="provider-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button 
                  className="ask-question-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate directly to provider's contact form
                    navigate(`/provider/${serviceId}/${provider.id}?tab=contact`);
                  }}
                  style={{
                    backgroundColor: '#4a6cf7',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a5bd9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a6cf7'}
                >
                  <i className="fas fa-question-circle"></i>
                  Ask Question
                </button>
                <button 
                  className="view-profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/provider/${serviceId}/${provider.id}`);
                  }}
                  style={{
                    backgroundColor: 'white',
                    color: '#4a6cf7',
                    border: '1px solid #4a6cf7',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9ff';
                    e.currentTarget.style.color = '#3a5bd9';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#4a6cf7';
                  }}
                >
                  <i className="fas fa-user"></i>
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ServiceProviders;