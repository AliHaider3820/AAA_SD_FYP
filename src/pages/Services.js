import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import servicesData from '../data/services';
import LocationBasedSearch from '../components/LocationBasedSearch';
import './Services.css';

const Services = () => {
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = useState('');
  const [matchingProviders, setMatchingProviders] = useState([]);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('reviews'); // Default sort by reviews
  
  const handleServiceClick = useCallback((serviceId) => {
    navigate(`/service-providers/${serviceId}`);
  }, [navigate]);

  const handleLocationSearch = useCallback((providers, searchTerm) => {
    console.log('Location search results:', providers);
    // Log each provider's serviceId and name for debugging
    providers.forEach(p => {
      console.log(`Provider: ${p.name}, Service ID: ${p.serviceId}, Type: ${typeof p.serviceId}`);
    });
    setShowLocationResults(providers.length > 0);
    setMatchingProviders(providers);
    setLocationQuery(searchTerm);
  }, []);

  // Use the imported services data
  const services = servicesData;
  
  // Create a function to get category by checking multiple possible fields
  const getServiceCategory = useCallback((serviceId, provider) => {
    // Debug log to see the full provider object
    console.log('Provider data:', {
      name: provider?.name,
      serviceId: provider?.serviceId,
      serviceCategory: provider?.serviceCategory,
      categoryName: provider?.categoryName,
      providerData: provider // Log the full provider object for debugging
    });
    
    // First try to get category from provider's categoryName field (if it exists)
    if (provider?.categoryName) {
      return provider.categoryName;
    }
    
    // Then try serviceCategory field
    if (provider?.serviceCategory) {
      // If serviceCategory is a number, look up the category name
      if (typeof provider.serviceCategory === 'number' || !isNaN(provider.serviceCategory)) {
        const id = typeof provider.serviceCategory === 'string' 
          ? parseInt(provider.serviceCategory, 10) 
          : provider.serviceCategory;
          
        const service = servicesData.find(s => s.id === id);
        if (service) return service.category;
      }
      // If serviceCategory is a string, use it directly
      return provider.serviceCategory;
    }
    
    // Fall back to serviceId if other fields are not available
    if (serviceId === undefined || serviceId === null) return 'Service Category';
    
    // Convert serviceId to number if it's a string
    const id = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId;
    
    // Find the service with matching ID
    const service = servicesData.find(s => s.id === id);
    
    // Return the category from the service, or a default value
    return service?.category || 'Service Category';
  }, []); // servicesData is not needed as a dependency since it's only used inside the callback

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sort and filter providers based on selected option
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
        default:
          return 0;
      }
    });
  };

  // Filter services based on search term and selected category
  const filteredServices = useMemo(() => {
    // If there are matching providers from location search, filter services to only show those with providers
    if (showLocationResults && matchingProviders.length > 0) {
      const serviceIdsWithProviders = [...new Set(matchingProviders.map(p => p.serviceId))];
      
      return services.filter(service => {
        const hasMatchingProviders = serviceIdsWithProviders.includes(service.id);
        const matchesSearch = searchTerm === '' || 
                           service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (service.tags && service.tags.some(tag => 
                             tag.toLowerCase().includes(searchTerm.toLowerCase())));
        
        const matchesCategory = !selectedCategory || service.category === selectedCategory;
        
        return hasMatchingProviders && matchesSearch && matchesCategory;
      });
    }
    
    // Default filter when no location search is active
    return services.filter(service => {
      const matchesSearch = searchTerm === '' || 
                         service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.tags && service.tags.some(tag => 
                           tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory, matchingProviders, showLocationResults]); // Removed categorySearchTerm and getServiceCategory as they are not used in the dependency calculation

  return (
    <div className="services-page">
      <div className="services-hero">
        <h1>Our Services</h1>
        <p>Discover our comprehensive range of professional services</p>
      </div>

      <div className="services-filters" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px', 
        flexWrap: 'wrap', 
        gap: '20px' 
      }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2rem', margin: 0 }}>
          Our Services
        </h1>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', flex: '1' }}>
          <div style={{ position: 'relative', minWidth: '250px', flex: '1' }}>
            <LocationBasedSearch onLocationSearch={handleLocationSearch} />
          </div>
          <div className="sort-filter" style={{ minWidth: '200px' }}>
            <select 
              className="sort-select"
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
              <option value="alphabetical">Sort by: A-Z</option>
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
          </div>
          <div className="category-filter" style={{ minWidth: '200px' }}>
            <select 
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Food">Food</option>
              <option value="Painting">Painting</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Gardening">Gardening</option>
              <option value="Repair">Repair</option>
              <option value="Transport">Transport</option>
              <option value="Security">Security</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>
      </div>

      {showLocationResults ? (
        <div className="providers-container">
          <div className="providers-header">
            <h3>Providers in: <span className="location-highlight">{locationQuery}</span></h3>
            <p>{matchingProviders.length} service providers found in this location</p>
            
            {/* Category Search Bar */}
            <div style={{ margin: '20px 0', maxWidth: '500px', width: '100%' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Filter by category..."
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
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
                <i className="fas fa-tags" style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666'
                }}></i>
                {categorySearchTerm && (
                  <button 
                    onClick={() => setCategorySearchTerm('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                setShowLocationResults(false);
                setLocationQuery('');
              }}
              className="back-to-services"
            >
              <i className="fas fa-arrow-left"></i> Back to All Services
            </button>
          </div>
          
          <div className="providers-grid">
            {(() => {
              // First filter by category
              let filteredProviders = matchingProviders.filter(provider => {
                if (!categorySearchTerm) return true;
                const providerCategory = getServiceCategory(provider.serviceId, provider).toLowerCase();
                return providerCategory.includes(categorySearchTerm.toLowerCase());
              });

              // Then sort the filtered providers
              filteredProviders = sortProviders(filteredProviders, sortOption);

              if (filteredProviders.length === 0) {
                return (
                  <div key="no-results" className="no-results" style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#666',
                    fontSize: '1.1rem'
                  }}>
                    <i className="fas fa-search" style={{
                      fontSize: '2.5rem',
                      marginBottom: '15px',
                      color: '#999'
                    }}></i>
                    <h3>No service providers found</h3>
                    <p>We couldn't find any providers matching "{categorySearchTerm}"</p>
                    <button 
                      onClick={() => setCategorySearchTerm('')}
                      style={{
                        marginTop: '15px',
                        padding: '8px 20px',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#3a7bc8'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#4a90e2'}
                    >
                      Clear search
                    </button>
                  </div>
                );
              }

              return filteredProviders.map(provider => (
              <div 
                key={`${provider.id}-${provider.serviceId || 'unknown'}`}
                className="provider-card"
                onClick={() => {
                  if (provider.id && provider.serviceId) {
                    navigate(`/provider/${provider.serviceId}/${provider.id}`);
                  }
                }}
              >
                <div className="provider-card-content">
                  <div className="provider-card-header">
                    <div className="provider-avatar">
                      <div className="avatar-container">
                        {provider.image || provider.profileImage || provider.profilePicture || provider.avatar ? (
                          <img 
                            className="provider-image"
                            src={provider.image || provider.profileImage || provider.profilePicture || provider.avatar}
                            alt={provider.name || 'Service Provider'}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              // Ensure image is visible after successful load
                              e.target.style.display = 'block';
                              const fallback = e.target.nextElementSibling;
                              if (fallback) fallback.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span 
                          className="avatar-initials"
                          style={{
                            display: (!provider.image && !provider.profileImage && !provider.profilePicture && !provider.avatar) ? 'flex' : 'none'
                          }}
                        >
                          {provider.name ? provider.name.charAt(0).toUpperCase() : 'P'}
                        </span>
                      </div>
                    </div>
                    <div className="provider-info">
                      <h3 className="provider-name" title={provider.name || 'Service Provider'}>
                        {provider.name || 'Service Provider'}
                      </h3>
                      <p className="provider-category">
                        <i className="fas fa-tag"></i>
                        {getServiceCategory(provider.serviceId, provider)}
                      </p>
                      <p className="provider-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span className="location-text" title={provider.location || provider.address || 'Location not specified'}>
                          {provider.location || provider.address || 'Location not specified'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {(provider.description || provider.about) && (
                    <div className="provider-description">
                      {provider.description || provider.about}
                    </div>
                  )}

                  {/* Skills/Tags */}
                  {(provider.skills || provider.tags) && (
                    <div className="skills-container">
                      {(provider.skills || provider.tags || []).slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button
                      className="action-button primary-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (provider.id && provider.serviceId) {
                          navigate(`/provider/${provider.serviceId}/${provider.id}`, {
                            state: { providerData: provider }
                          });
                        }
                      }}
                    >
                      <i className="fas fa-user"></i>
                      View Profile
                    </button>
                    <button
                      className="action-button secondary-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (provider.phone) {
                          window.location.href = `tel:${provider.phone}`;
                        } else if (provider.email) {
                          window.location.href = `mailto:${provider.email}`;
                        } else if (provider.contactNumber) {
                          window.location.href = `tel:${provider.contactNumber}`;
                        }
                      }}
                    >
                      <i className="fas fa-phone-alt"></i>
                      Contact
                    </button>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="rating-section">
                    <div className="rating-container">
                      <div className="rating-badge">
                        {provider.rating ? provider.rating.toFixed(1) : 'N/A'}
                      </div>
                      <div>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i 
                              key={star}
                              className={`fas fa-star${star <= Math.round(provider.rating || 0) ? ' filled' : '-o'}`} 
                            ></i>
                          ))}
                        </div>
                        <div className="rating-count">
                          {provider.reviews ? `${provider.reviews} ${provider.reviews === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}
                        </div>
                      </div>
                    </div>
                    
                    {(provider.completedJobs || provider.completedProjects) && (
                      <div className="stat-item">
                        <div className="stat-value">
                          {provider.completedJobs || provider.completedProjects || '0'}
                        </div>
                        <div className="stat-label">
                          Jobs Done
                        </div>
                      </div>
                    )}
                    
                    {provider.responseRate && (
                      <div>
                        <div className="response-rate">
                          {provider.responseRate}%
                          <i className="fas fa-bolt"></i>
                        </div>
                        <div className="stat-label">
                          Response Rate
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ));
            })()}
          </div>
        </div>
      ) : matchingProviders.length === 0 && locationQuery ? (
        <div className="no-providers-message">
          <i className="fas fa-exclamation-circle error-icon"></i>
          <h3>No providers found in "{locationQuery}"</h3>
          <p>Try a different location or check back later for more providers in your area.</p>
          <button 
            onClick={() => {
              setShowLocationResults(false);
              setLocationQuery('');
            }}
            className="back-to-services"
          >
            <i className="fas fa-arrow-left"></i> Back to All Services
          </button>
        </div>
      ) : null}
      
      {!showLocationResults && (
        <div className="services-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => (
              <div 
                className="service-card" 
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-tags">
                  {service.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="view-providers">
                  <span>View Providers</span>
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results" style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px 20px', 
              color: '#666' 
            }}>
              <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.5 }}></i>
              <h3>No services found{searchTerm ? ` matching "${searchTerm}"` : ''}</h3>
              <p>Try a different search term or check back later for more services.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
