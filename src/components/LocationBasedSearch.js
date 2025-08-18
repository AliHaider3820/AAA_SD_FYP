import React, { useState, useEffect, useCallback } from 'react';
import serviceProvidersData from '../data/serviceProviders';

const LocationBasedSearch = ({ onLocationSearch }) => {
  const [locationQuery, setLocationQuery] = useState('');

  // Get all providers from both static data and localStorage
  const getAllProviders = useCallback(() => {
    try {
      const localStorageData = localStorage.getItem('serviceProviders');
      const localProviders = localStorageData ? JSON.parse(localStorageData) : {};
      
      // Create a deep copy of static providers
      const combinedProviders = JSON.parse(JSON.stringify(serviceProvidersData));
      
      // Handle different localStorage structures
      if (Array.isArray(localProviders)) {
        if (!combinedProviders[1]) combinedProviders[1] = [];
        localProviders.forEach(provider => {
          if (provider && !combinedProviders[1].some(p => p.id === provider.id || p.name === provider.name)) {
            combinedProviders[1].push(provider);
          }
        });
      } 
      else if (typeof localProviders === 'object' && localProviders !== null) {
        Object.entries(localProviders).forEach(([serviceId, providersForService]) => {
          const serviceIdNum = parseInt(serviceId);
          if (isNaN(serviceIdNum)) return;
          
          if (!combinedProviders[serviceIdNum]) {
            combinedProviders[serviceIdNum] = [];
          }
          
          if (Array.isArray(providersForService)) {
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
        });
      }
      
      return combinedProviders;
    } catch (error) {
      console.error('Error loading providers:', error);
      return serviceProvidersData;
    }
  }, []);

  // Handle location search
  useEffect(() => {
    const searchTerm = locationQuery.trim().toLowerCase();
    
    if (!searchTerm) {
      if (onLocationSearch) onLocationSearch([], '');
      return;
    }

    const allProviders = getAllProviders();
    const matches = [];
    const seenProviderIds = new Set();

    // Find all providers matching the location across all services
    Object.entries(allProviders).forEach(([serviceId, serviceProviders]) => {
      if (!Array.isArray(serviceProviders)) return;
      
      serviceProviders.forEach((provider) => {
        try {
          if (!provider || !provider.id || !provider.name || seenProviderIds.has(provider.id)) {
            return;
          }
          seenProviderIds.add(provider.id);
          
          // Use the parent serviceId (from the object key) as the provider's serviceId
          const validServiceId = Number(serviceId);
          if (isNaN(validServiceId)) return;
          
          // Check location fields
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
          ].filter(Boolean);
          
          const locationMatch = locationFields.some(field => 
            String(field).toLowerCase().includes(searchTerm)
          );
          
          if (locationMatch) {
            // Get the service ID from the parent key and ensure it's a number
            const serviceIdNum = parseInt(serviceId, 10);
            
            if (!isNaN(serviceIdNum)) {
              // Create a new object with the serviceId from the parent key
              const normalizedProvider = {
                ...provider,
                serviceId: serviceIdNum, // Explicitly set the serviceId
                // Clear any existing category to ensure we use the one from services data
                category: undefined,
                serviceCategory: undefined,
                image: provider.image || provider.profileImage || provider.profilePicture || provider.avatar
              };
              
              matches.push(normalizedProvider);
            }
          }
        } catch (error) {
          console.error('Error processing provider:', error);
        }
      });
    });

    // Sort matches by rating (highest first) and then by name
    const sortedMatches = [...matches].sort((a, b) => {
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return (a.name || '').localeCompare(b.name || '');
    });
    
    if (onLocationSearch) {
      onLocationSearch(sortedMatches, searchTerm);
    }
  }, [locationQuery, getAllProviders, onLocationSearch]);

  return (
    <div className="location-search-container">
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
    </div>
  );
};

export default LocationBasedSearch;
