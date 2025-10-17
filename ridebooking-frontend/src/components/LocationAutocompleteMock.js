import React, { useState, useEffect, useRef } from 'react';

/**
 * Mock LocationAutocomplete Component (Fallback when Google Maps API is not available)
 * Provides simulated autocomplete functionality for testing purposes
 */
const LocationAutocompleteMock = ({ 
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

  // Mock location data for testing
  const mockLocations = [
    {
      place_id: "ChIJ1",
      description: "3293 Southern Ave, Memphis, TN 38111, USA",
      structured_formatting: {
        main_text: "3293 Southern Ave",
        secondary_text: "Memphis, TN 38111, USA"
      },
      coordinates: { lat: 35.0870, lng: -89.9709 },
      name: "3293 Southern Ave"
    },
    {
      place_id: "ChIJ2", 
      description: "3293 Southern Avenue, Louisville, KY 40214, USA",
      structured_formatting: {
        main_text: "3293 Southern Avenue",
        secondary_text: "Louisville, KY 40214, USA"
      },
      coordinates: { lat: 38.1662, lng: -85.8341 },
      name: "3293 Southern Avenue"
    },
    {
      place_id: "ChIJ3",
      description: "3293 Southern Blvd, Bronx, NY 10458, USA", 
      structured_formatting: {
        main_text: "3293 Southern Blvd",
        secondary_text: "Bronx, NY 10458, USA"
      },
      coordinates: { lat: 40.8566, lng: -73.8776 },
      name: "3293 Southern Blvd"
    },
    {
      place_id: "ChIJ4",
      description: "University of Memphis, Memphis, TN 38152, USA",
      structured_formatting: {
        main_text: "University of Memphis",
        secondary_text: "Memphis, TN 38152, USA"
      },
      coordinates: { lat: 35.1174, lng: -89.9711 },
      name: "University of Memphis"
    },
    {
      place_id: "ChIJ4b",
      description: "University of Michigan, Ann Arbor, MI 48109, USA",
      structured_formatting: {
        main_text: "University of Michigan",
        secondary_text: "Ann Arbor, MI 48109, USA"
      },
      coordinates: { lat: 42.2780, lng: -83.7382 },
      name: "University of Michigan"
    },
    {
      place_id: "ChIJ5",
      description: "Detroit Metropolitan Wayne County Airport, Detroit, MI 48242, USA",
      structured_formatting: {
        main_text: "Detroit Metro Airport",
        secondary_text: "Detroit, MI 48242, USA"
      },
      coordinates: { lat: 42.2162, lng: -83.3554 },
      name: "Detroit Metropolitan Wayne County Airport"
    },
    {
      place_id: "ChIJ6",
      description: "Times Square, New York, NY 10036, USA",
      structured_formatting: {
        main_text: "Times Square",
        secondary_text: "New York, NY 10036, USA"
      },
      coordinates: { lat: 40.7589, lng: -73.9851 },
      name: "Times Square"
    },
    {
      place_id: "ChIJ7",
      description: "Starbucks Coffee, 1234 Main St, Memphis, TN 38103, USA",
      structured_formatting: {
        main_text: "Starbucks Coffee",
        secondary_text: "1234 Main St, Memphis, TN 38103, USA"
      },
      coordinates: { lat: 35.1495, lng: -90.0490 },
      name: "Starbucks Coffee"
    },
    {
      place_id: "ChIJ8",
      description: "McDonald's, 5678 Poplar Ave, Memphis, TN 38119, USA",
      structured_formatting: {
        main_text: "McDonald's",
        secondary_text: "5678 Poplar Ave, Memphis, TN 38119, USA"
      },
      coordinates: { lat: 35.1174, lng: -89.8508 },
      name: "McDonald's"
    },
    {
      place_id: "ChIJ9",
      description: "Mall of America, Bloomington, MN 55425, USA",
      structured_formatting: {
        main_text: "Mall of America",
        secondary_text: "Bloomington, MN 55425, USA"
      },
      coordinates: { lat: 44.8548, lng: -93.2422 },
      name: "Mall of America"
    },
    {
      place_id: "ChIJ10",
      description: "Central Park, New York, NY 10024, USA",
      structured_formatting: {
        main_text: "Central Park",
        secondary_text: "New York, NY 10024, USA"
      },
      coordinates: { lat: 40.7829, lng: -73.9654 },
      name: "Central Park"
    },
    {
      place_id: "ChIJ11",
      description: "Memphis International Airport, Memphis, TN 38116, USA",
      structured_formatting: {
        main_text: "Memphis International Airport",
        secondary_text: "Memphis, TN 38116, USA"
      },
      coordinates: { lat: 35.0424, lng: -89.9767 },
      name: "Memphis International Airport"
    },
    {
      place_id: "ChIJ12",
      description: "Beale Street, Memphis, TN 38103, USA",
      structured_formatting: {
        main_text: "Beale Street",
        secondary_text: "Memphis, TN 38103, USA"
      },
      coordinates: { lat: 35.1399, lng: -90.0520 },
      name: "Beale Street"
    },
    {
      place_id: "ChIJ13",
      description: "Graceland, Memphis, TN 38116, USA",
      structured_formatting: {
        main_text: "Graceland",
        secondary_text: "Memphis, TN 38116, USA"
      },
      coordinates: { lat: 35.0477, lng: -90.0260 },
      name: "Graceland"
    },
    {
      place_id: "ChIJ14",
      description: "7660 Airways Blvd, Memphis, TN 38132, USA",
      structured_formatting: {
        main_text: "7660 Airways Blvd",
        secondary_text: "Memphis, TN 38132, USA"
      },
      coordinates: { lat: 35.0869, lng: -89.9383 },
      name: "7660 Airways Blvd"
    }
  ];

  // Handle input changes and show mock suggestions
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    console.log('Mock autocomplete input changed:', inputValue);
    onChange(inputValue);

    if (inputValue.length > 2) {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const filteredSuggestions = mockLocations.filter(location =>
          location.description.toLowerCase().includes(inputValue.toLowerCase()) ||
          location.structured_formatting.main_text.toLowerCase().includes(inputValue.toLowerCase())
        );
        
        console.log('Mock filtered suggestions:', filteredSuggestions);
        setSuggestions(filteredSuggestions.slice(0, 5));
        setShowSuggestions(filteredSuggestions.length > 0);
        setIsLoading(false);
      }, 500); // Simulate network delay
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

    // Create mock location data
    const locationData = {
      address: suggestion.description,
      name: suggestion.name,
      placeId: suggestion.place_id,
      coordinates: suggestion.coordinates
    };
    
    // Call the callback with mock location data
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

      {/* Mock API indicator */}
      <div style={{
        fontSize: '11px',
        color: '#888',
        marginTop: '4px',
        fontStyle: 'italic'
      }}>
        📍 Mock suggestions (configure Google Maps API for real data)
      </div>
    </div>
  );
};

export default LocationAutocompleteMock;
