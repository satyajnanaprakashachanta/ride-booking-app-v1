import React from 'react';
import LocationAutocompleteOSM from './LocationAutocompleteOSM';

/**
 * LocationAutocomplete Component
 * Provides real-time location autocomplete using OpenStreetMap (100% free)
 * No API keys required, unlimited usage, worldwide coverage
 */
const LocationAutocomplete = ({ 
  placeholder, 
  value, 
  onChange, 
  onLocationSelect,
  required = false,
  style = {} 
}) => {
  // Always use the free OpenStreetMap service
  return (
    <LocationAutocompleteOSM
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onLocationSelect={onLocationSelect}
      required={required}
      style={style}
    />
  );
};

export default LocationAutocomplete;
