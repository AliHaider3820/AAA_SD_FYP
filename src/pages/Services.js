import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceProvidersData from '../data/serviceProviders';
import servicesData from '../data/services';
import './Services.css';

const Services = () => {
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = useState('');
  const [matchingProviders, setMatchingProviders] = useState([]);
  
  const handleServiceClick = useCallback((serviceId) => {
    navigate(`/service-providers/${serviceId}`);
  }, [navigate]);

  // Use the imported services data
  const services = servicesData;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get all providers from both static data and localStorage
  const getAllProviders = useCallback(() => {
    try {
      // Get providers from localStorage
      const localStorageData = localStorage.getItem('serviceProviders');
      console.log('Raw localStorage data:', localStorageData);
      
      const localProviders = localStorageData ? JSON.parse(localStorageData) : {};
      console.log('Parsed local providers:', localProviders);
      
      // Create a deep copy of static providers to avoid modifying the original
      const combinedProviders = JSON.parse(JSON.stringify(serviceProvidersData));
      
      // Check if localProviders is an array (direct array of providers)
      if (Array.isArray(localProviders)) {
        console.log('Found array of providers in localStorage');
        // If it's an array, add all providers to a default service (e.g., 1 for first service)
        if (!combinedProviders[1]) combinedProviders[1] = [];
        localProviders.forEach(provider => {
          if (provider && !combinedProviders[1].some(p => p.id === provider.id || p.name === provider.name)) {
            combinedProviders[1].push(provider);
          }
        });
      } 
      // Handle object structure {serviceId: [providers]}
      else if (typeof localProviders === 'object' && localProviders !== null) {
        console.log('Processing providers by service ID');
        Object.entries(localProviders).forEach(([serviceId, providersForService]) => {
          const serviceIdNum = parseInt(serviceId);
          if (isNaN(serviceIdNum)) return;
          
          // Initialize array for this service ID if it doesn't exist
          if (!combinedProviders[serviceIdNum]) {
            combinedProviders[serviceIdNum] = [];
          }
          
          // Handle array of providers
          if (Array.isArray(providersForService)) {
            console.log(`Found ${providersForService.length} providers for service ${serviceId}`);
            providersForService.forEach(provider => {
              if (!provider) return;
              const exists = combinedProviders[serviceIdNum].some(p => 
                (p.id && p.id === provider.id) || 
                (p.name && p.name === provider.name)
              );
              if (!exists) {
                combinedProviders[serviceIdNum].push(provider);
              }
            });
          } 
          // Handle single provider object
          else if (typeof providersForService === 'object' && providersForService !== null) {
            console.log('Found single provider object');
            const providerArray = Object.values(providersForService).filter(Boolean);
            providerArray.forEach(provider => {
              const exists = combinedProviders[serviceIdNum].some(p => 
                (p.id && p.id === provider.id) || 
                (p.name && p.name === provider.name)
              );
              if (!exists) {
                combinedProviders[serviceIdNum].push(provider);
              }
            });
          }
        });
      }
      
      // Log the final combined providers for debugging
      console.log('Final combined providers by service ID:');
      Object.entries(combinedProviders).forEach(([id, providers]) => {
        console.log(`Service ${id} has ${Array.isArray(providers) ? providers.length : 'invalid'} providers`);
      });
      
      return combinedProviders;
    } catch (error) {
      console.error('Error loading providers:', error);
      return serviceProvidersData; // Fallback to static data
    }
  }, []);

  // Update matching providers when location query changes
  useEffect(() => {
    const searchTerm = locationQuery.trim().toLowerCase();
    
    if (!searchTerm) {
      setMatchingProviders([]);
      return;
    }

    console.log('Searching for location:', searchTerm);
    const allProviders = getAllProviders();
    console.log('All providers by service ID:', allProviders);
    
    const matches = [];
    const seenProviderIds = new Set();

    // Find all providers matching the location across all services
    Object.entries(allProviders).forEach(([serviceId, serviceProviders]) => {
      if (!Array.isArray(serviceProviders)) {
        console.log(`Skipping non-array providers for service ${serviceId}`);
        return;
      }
      
      console.log(`Checking ${serviceProviders.length} providers for service ${serviceId}`);
      
      serviceProviders.forEach((provider, index) => {
        try {
          // Skip if provider is invalid or missing required fields
          if (!provider || !provider.id || !provider.name) {
            console.log(`Skipping invalid provider at index ${index}:`, provider);
            return;
          }

          // Skip duplicate providers
          if (seenProviderIds.has(provider.id)) {
            console.log(`Skipping duplicate provider ID: ${provider.id}`);
            return;
          }
          seenProviderIds.add(provider.id);
          
          // Ensure provider has a valid serviceId
          const validServiceId = provider.serviceId || serviceId;
          if (!validServiceId) {
            console.log('Skipping provider with no service ID:', provider);
            return;
          }
          
          // Ensure provider has at least one image source
          const hasImage = Boolean(provider.image || provider.profileImage || provider.avatar);
          
          // Log provider details for debugging
          console.log(`Checking provider ${index + 1}:`, {
            id: provider.id,
            name: provider.name,
            hasImage,
            serviceId: validServiceId
          });
          
          // Get all possible location fields and clean them up
          const locationFields = [
            provider.location,
            provider.address,
            provider.city,
            provider.area,
            provider.officeLocation,
            provider.contact?.address,
            provider.profile?.location,
            provider.contact?.city,
            provider.contact?.state,
            provider.contact?.zipCode
          ].filter(Boolean); // Remove falsy values
          
          console.log('Location fields:', locationFields);
          
          // Check if any location field contains the search term
          const locationMatch = locationFields.some(field => {
            if (!field) return false;
            const fieldText = String(field).toLowerCase().trim();
            return fieldText.includes(searchTerm);
          });
          
          // For debugging, get the first non-empty location
          const locationText = locationFields.find(Boolean);
          
          if (locationMatch) {
            console.log(`Match found for provider ${provider.name} (${provider.id})`);
            console.log('Matching location fields:', locationFields);
            
            // Create a normalized provider object with all required fields
            const normalizedProvider = {
              id: provider.id,
              name: provider.name || 'Service Provider',
              rating: provider.rating || 0,
              experience: provider.experience || 'Not specified',
              phone: provider.phone || provider.contactNumber || 'Not provided',
              location: provider.location || provider.address || 'Location not specified',
              description: provider.description || provider.about || 'No description available',
              serviceId: validServiceId,
              // Image sources - check all possible image field names
              image: provider.image || provider.profileImage || provider.profilePicture || provider.avatar,
              // Additional fields
              ...provider
            };
            
            // Add debug information
            console.log('Added provider to matches:', {
              name: normalizedProvider.name,
              location: normalizedProvider.location,
              serviceId: normalizedProvider.serviceId
            });
            
            matches.push(normalizedProvider);
          } else {
            console.log('No match for provider:', {
              name: provider.name,
              locationFields,
              searchTerm,
              hasLocationFields: locationFields.length > 0
            });
          }
        } catch (error) {
          console.error('Error processing provider:', {
            error: error.message,
            provider,
            serviceId
          }, error);
        }
      });
    });

    console.log(`Found ${matches.length} matching providers for "${searchTerm}":`, matches);
    
    // Sort matches by rating (highest first) and then by name
    const sortedMatches = [...matches].sort((a, b) => {
      // First sort by rating (descending)
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      // If ratings are equal, sort by name (ascending)
      return (a.name || '').localeCompare(b.name || '');
    });
    
    console.log('Setting matching providers:', sortedMatches);
    setMatchingProviders(sortedMatches);
  }, [locationQuery, getAllProviders]);

  // Function to check if a service has providers in the specified location
  // (This function is kept for potential future use)
  // const hasProvidersInLocation = (serviceId) => {
  //   // If no location query, show all services
  //   if (!locationQuery.trim()) return true;
    
  //   // If we have matching providers, only show services that have matching providers
  //   if (matchingProviders.length > 0) {
  //     return matchingProviders.some(p => p.serviceId === serviceId);
  //   }
    
  //   // If no matching providers, don't show any services
  //   return false;
  // };

  // Filter services based on search term and selected category
  const filteredServices = useMemo(() => {
    // If there's a location query, show all services that have providers in that location
    if (locationQuery.trim()) {
      // Get unique service IDs from matching providers
      const serviceIdsWithProviders = [...new Set(matchingProviders.map(p => p.serviceId))];
      
      return services.filter(service => {
        // Only include services that have providers in the searched location
        const hasMatchingProviders = serviceIdsWithProviders.includes(service.id);
        
        // Apply other filters (search term and category)
        const matchesSearch = searchTerm === '' || 
                           service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = !selectedCategory || service.category === selectedCategory;
        
        return hasMatchingProviders && matchesSearch && matchesCategory;
      });
    }
    
    // If no location query, filter normally
    return services.filter(service => {
      const matchesSearch = searchTerm === '' || 
                         service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory, matchingProviders, locationQuery]);

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
            <input
              type="text"
              placeholder="Search by location..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
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
            <i className="fas fa-map-marker-alt" style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }}></i>
            {locationQuery && (
              <button 
                onClick={() => setLocationQuery('')}
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
          <div style={{ position: 'relative', minWidth: '250px', flex: '1' }}>
            <input
              type="text"
              placeholder="Search services by catogries..."
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
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
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

      {locationQuery.trim() && matchingProviders.length > 0 ? (
        <>
          <div className="providers-header">
            <h3>Providers in: <span className="location-highlight">{locationQuery}</span></h3>
            <p>{matchingProviders.length} service providers found in this location</p>
          </div>
          
          <div className="providers-grid">
            {matchingProviders.map(provider => (
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
                      <p className="provider-title">
                        {provider.serviceTitle || provider.title || 'Service Professional'}
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
                        console.log('Navigating to provider profile:', {
                          serviceId: provider.serviceId,
                          providerId: provider.id,
                          providerName: provider.name
                        });
                        if (provider.id && provider.serviceId) {
                          navigate(`/provider/${provider.serviceId}/${provider.id}`, {
                            state: { providerData: provider }
                          });
                        } else {
                          console.error('Missing required data for navigation:', {
                            hasId: !!provider.id,
                            hasServiceId: !!provider.serviceId
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
                          {provider.reviewCount ? `${provider.reviewCount} ${provider.reviewCount === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}
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
            ))}
          </div>
          
          <div className="divider-with-text">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>
          
          <h3>Services available in this location:</h3>
        </>
      ) : locationQuery.trim() ? (
        <div className="no-providers-message">
          <i className="fas fa-exclamation-circle error-icon"></i>
          <h3>No providers found in "{locationQuery}"</h3>
          <p>Try a different location or check back later for more providers in your area.</p>
        </div>
      ) : null}
      
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
    </div>
  );
};

export default Services;
