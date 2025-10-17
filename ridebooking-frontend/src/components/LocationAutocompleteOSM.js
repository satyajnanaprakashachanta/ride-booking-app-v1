import React, { useState, useEffect, useRef } from 'react';

/**
 * Free LocationAutocomplete using OpenStreetMap Nominatim API
 * No API key required, completely free, unlimited usage
 */
const LocationAutocompleteOSM = ({ 
  placeholder, 
  value, 
  onChange, 
  onLocationSelect,
  required = false,
  style = {} 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const searchTimeout = useRef(null);

  // Fetch suggestions from OpenStreetMap Nominatim API (FREE)
  const fetchSuggestions = async (query) => {
    try {
      setIsLoading(true);
      
      // OpenStreetMap Nominatim API - completely free, no API key needed
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}&countrycodes=us`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      
      // Transform OSM data to match our format
      const transformedSuggestions = data.map((item, index) => ({
        place_id: item.place_id || `osm_${index}`,
        description: item.display_name,
        structured_formatting: {
          main_text: item.name || item.display_name.split(',')[0],
          secondary_text: item.display_name.split(',').slice(1).join(',').trim()
        },
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        },
        name: item.name || item.display_name.split(',')[0]
      }));
      
      setSuggestions(transformedSuggestions);
      setShowSuggestions(transformedSuggestions.length > 0);
      
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes with debouncing
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (inputValue.length > 2) {
      // Debounce API calls - wait 300ms after user stops typing
      searchTimeout.current = setTimeout(() => {
        fetchSuggestions(inputValue);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  // Handle selection of a suggestion
  const handleSuggestionClick = (suggestion) => {
    const selectedAddress = suggestion.description;
    onChange(selectedAddress);
    setShowSuggestions(false);

    // Create location data
    const locationData = {
      address: suggestion.description,
      name: suggestion.name,
      placeId: suggestion.place_id,
      coordinates: suggestion.coordinates
    };
    
    // Call the callback with location data
    if (onLocationSelect) {
      onLocationSelect(locationData);
    }
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', ...style }} ref={inputRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        required={required}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
          boxSizing: 'border-box'
        }}
        autoComplete="off"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#666',
          fontSize: '12px'
        }}>
          Searching...
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderTop: 'none',
          borderRadius: '0 0 5px 5px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                backgroundColor: 'white',
                fontSize: '14px',
                lineHeight: '1.4'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                {suggestion.structured_formatting.main_text}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {suggestion.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Free API indicator */}

    </div>
  );
};

export default LocationAutocompleteOSM;
