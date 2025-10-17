import React, { useState } from 'react';
import LocationAutocomplete from './components/LocationAutocomplete';

/**
 * Test component to verify location autocomplete functionality
 * Use this to test both pickup and drop location inputs independently
 */
function LocationTest() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupData, setPickupData] = useState(null);
  const [dropData, setDropData] = useState(null);

  const handlePickupLocationSelect = (locationData) => {
    setPickupData(locationData);
    console.log('Pickup location selected:', locationData);
  };

  const handleDropLocationSelect = (locationData) => {
    setDropData(locationData);
    console.log('Drop location selected:', locationData);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Location Autocomplete Test</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Test Instructions:</h3>
        <ul>
          <li>Type "3293 southern" in either field to see mock suggestions</li>
          <li>Type "starbucks", "times square", "central park", or "mall" for other suggestions</li>
          <li>Check browser console for debug logs</li>
          <li>Both fields should work identically</li>
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>🚗 Pickup Location</h3>
        <LocationAutocomplete
          placeholder="Enter pickup location (try: 3293 southern)"
          value={pickupLocation}
          onChange={setPickupLocation}
          onLocationSelect={handlePickupLocationSelect}
          required={false}
        />
        {pickupData && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#e8f5e9',
            borderRadius: '5px'
          }}>
            <strong>Pickup Selected:</strong><br />
            Address: {pickupData.address}<br />
            Coordinates: {pickupData.coordinates.lat}, {pickupData.coordinates.lng}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>🎯 Drop Location</h3>
        <LocationAutocomplete
          placeholder="Enter drop location (try: starbucks)"
          value={dropLocation}
          onChange={setDropLocation}
          onLocationSelect={handleDropLocationSelect}
          required={false}
        />
        {dropData && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#e3f2fd',
            borderRadius: '5px'
          }}>
            <strong>Drop Selected:</strong><br />
            Address: {dropData.address}<br />
            Coordinates: {dropData.coordinates.lat}, {dropData.coordinates.lng}
          </div>
        )}
      </div>

      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3e0', 
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>Debug Info:</strong><br />
        Pickup Input: "{pickupLocation}"<br />
        Drop Input: "{dropLocation}"<br />
        Pickup Data: {pickupData ? 'Selected' : 'None'}<br />
        Drop Data: {dropData ? 'Selected' : 'None'}
      </div>
    </div>
  );
}

export default LocationTest;
