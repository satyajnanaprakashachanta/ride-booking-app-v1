import React, { useState } from "react";
import axios from "axios";
import BookingStatus from "./BookingStatus";
import BookingHistory from "./BookingHistory";
import LocationAutocomplete from "./components/LocationAutocomplete";

function BookingForm({ userInfo, onBookingSuccess }) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [distanceInMiles, setDistanceInMiles] = useState("");
  const [fare, setFare] = useState("");
  const [response, setResponse] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  
  // Location data state for storing detailed location information
  const [pickupLocationData, setPickupLocationData] = useState(null);
  const [dropLocationData, setDropLocationData] = useState(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Auto-calculate distance and fare when both locations are selected
  const updateDistanceAndFare = React.useCallback(() => {
    if (pickupLocationData && dropLocationData) {
      const distance = calculateDistance(
        pickupLocationData.coordinates.lat,
        pickupLocationData.coordinates.lng,
        dropLocationData.coordinates.lat,
        dropLocationData.coordinates.lng
      );
      
      setDistanceInMiles(distance.toString());
      
      // Estimate fare: base rate $2.50 + $1.75 per mile
      const estimatedFare = 2.50 + (distance * 1.75);
      setFare(estimatedFare.toFixed(2));
    }
  }, [pickupLocationData, dropLocationData]);

  // Handle pickup location selection
  const handlePickupLocationSelect = (locationData) => {
    setPickupLocationData(locationData);
    console.log('Pickup location selected:', locationData);
  };

  // Handle drop location selection
  const handleDropLocationSelect = (locationData) => {
    setDropLocationData(locationData);
    console.log('Drop location selected:', locationData);
  };

  // Debug logging
  React.useEffect(() => {
    console.log('Drop location input value:', dropLocation);
  }, [dropLocation]);

  React.useEffect(() => {
    console.log('Drop location data:', dropLocationData);
  }, [dropLocationData]);

  // Update distance and fare when either location changes
  React.useEffect(() => {
    updateDistanceAndFare();
  }, [updateDistanceAndFare]);  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First, try to find available rides that match the route
      const ridesResponse = await axios.get("http://localhost:8081/rides");
      const matchingRides = ridesResponse.data.filter(ride => 
        ride.pickupLocation.toLowerCase().includes(pickupLocation.toLowerCase()) ||
        ride.dropLocation.toLowerCase().includes(dropLocation.toLowerCase()) ||
        ride.status === 'AVAILABLE' || ride.status === 'PENDING'
      );

      let selectedRide;
      
      if (matchingRides.length > 0) {
        // Use existing ride if available
        selectedRide = matchingRides[0];
      } else {
        // Create a new ride request that drivers can accept
        const newRideResponse = await axios.post("http://localhost:8081/rides", {
          pickupLocation: pickupLocation,
          dropLocation: dropLocation,
          distanceInMiles: 5.0, // Default estimate
          estimatedDurationMinutes: 15, // Default estimate
          price: 15.0, // Default estimate
          status: "PENDING"
        });
        selectedRide = newRideResponse.data;
      }

      // Find or create the rider user in the old user system for compatibility
      const usersResponse = await axios.get("http://localhost:8081/users");
      let riderUser = usersResponse.data.find(user => 
        user.name === userInfo.fullName && user.role === "RIDER"
      );
      
      if (!riderUser) {
        // Create new rider user for compatibility with existing system
        const newUserResponse = await axios.post("http://localhost:8081/users", {
          name: userInfo.fullName,
          phoneNumber: userInfo.mobileNumber,
          email: `${userInfo.fullName.toLowerCase().replace(/\s+/g, '')}@rider.com`,
          role: "RIDER",
          status: "ACTIVE"
        });
        riderUser = newUserResponse.data;
      }

      // Create the booking with enhanced location data
      const bookingData = {
        pickupLocation: pickupLocationData ? pickupLocationData.address : pickupLocation,
        dropLocation: dropLocationData ? dropLocationData.address : dropLocation,
        rideTime: rideTime || new Date().toISOString(),
        distanceInMiles: distanceInMiles ? parseFloat(distanceInMiles) : null,
        fare: fare ? parseFloat(fare) : null,
        // Enhanced location data for driver visibility (serialize as JSON strings)
        pickupLocationDetails: pickupLocationData ? JSON.stringify({
          name: pickupLocationData.name,
          placeId: pickupLocationData.placeId,
          coordinates: pickupLocationData.coordinates
        }) : null,
        dropLocationDetails: dropLocationData ? JSON.stringify({
          name: dropLocationData.name,
          placeId: dropLocationData.placeId,
          coordinates: dropLocationData.coordinates
        }) : null
      };

      const res = await axios.post(`http://localhost:8081/bookings/${selectedRide.rideId}/${riderUser.userId}`, bookingData);
      setResponse(res.data);
      setCurrentBookingId(res.data.bookingId);
      setShowStatusModal(true);
      
      // Show success message with booking ID
      // Show success message
      alert(`🎉 Booking Created Successfully!

Booking ID: ${res.data.bookingId}

Check your Booking History for updates.`);
      
      // Call the callback to refresh booking history and navigate there
      if (onBookingSuccess) {
        onBookingSuccess();
      }
      
      // Call the callback to refresh booking history and navigate there
      if (onBookingSuccess) {
        onBookingSuccess();
      }
      
      // Reset form
      setPickupLocation('');
      setDropLocation('');
      setRideTime('');
      setDistanceInMiles('');
      setFare('');
    } catch (error) {
      console.error(error);
      alert("Error creating booking. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
      <form onSubmit={handleSubmit}>
        {/* Enhanced Location Inputs with Google Maps Autocomplete */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontWeight: "bold", 
            color: "#333",
            fontSize: "14px"
          }}>
            Pickup Location
          </label>
          <LocationAutocomplete
            placeholder="Enter pickup address (e.g., 3293 southern ave)"
            value={pickupLocation}
            onChange={setPickupLocation}
            onLocationSelect={handlePickupLocationSelect}
            required={true}
          />
          {pickupLocationData && (
            <div style={{ 
              marginTop: "5px", 
              fontSize: "12px", 
              color: "#666",
              backgroundColor: "#f0f8f0",
              padding: "5px 8px",
              borderRadius: "3px"
            }}>
              ✓ Exact location found: {pickupLocationData.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontWeight: "bold", 
            color: "#333",
            fontSize: "14px"
          }}>
            Drop-off Location
          </label>
          <LocationAutocomplete
            placeholder="Enter destination address"
            value={dropLocation}
            onChange={setDropLocation}
            onLocationSelect={handleDropLocationSelect}
            required={true}
          />
          {dropLocationData && (
            <div style={{ 
              marginTop: "5px", 
              fontSize: "12px", 
              color: "#666",
              backgroundColor: "#f0f8f0",
              padding: "5px 8px",
              borderRadius: "3px"
            }}>
              ✓ Exact location found: {dropLocationData.name}
            </div>
          )}
        </div>
        
        {/* Distance and Fare Input Fields - Auto-calculated when locations are selected */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "bold", 
              color: "#333",
              fontSize: "13px"
            }}>
              Distance (miles) {pickupLocationData && dropLocationData ? "- Auto-calculated" : ""}
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Distance (miles)"
              value={distanceInMiles}
              onChange={(e) => setDistanceInMiles(e.target.value)}
              style={{ 
                padding: "12px", 
                borderRadius: "5px", 
                border: "1px solid #ccc", 
                fontSize: "16px",
                width: "100%",
                backgroundColor: pickupLocationData && dropLocationData ? "#f9f9f9" : "white"
              }}
            />
          </div>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "bold", 
              color: "#333",
              fontSize: "13px"
            }}>
              Estimated Fare ($) {pickupLocationData && dropLocationData ? "- Auto-calculated" : ""}
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Fare ($)"
              value={fare}
              onChange={(e) => setFare(e.target.value)}
              style={{ 
                padding: "12px", 
                borderRadius: "5px", 
                border: "1px solid #ccc", 
                fontSize: "16px",
                width: "100%",
                backgroundColor: pickupLocationData && dropLocationData ? "#f9f9f9" : "white"
              }}
            />
          </div>
        </div>

        {/* Auto-calculation info */}
        {pickupLocationData && dropLocationData && (
          <div style={{
            backgroundColor: "#e3f2fd",
            border: "1px solid #2196f3",
            borderRadius: "5px",
            padding: "10px",
            marginBottom: "15px",
            fontSize: "13px",
            color: "#1976d2"
          }}>
            ✨ Distance and fare automatically calculated based on exact locations!
          </div>
        )}
        
        {/* User Info Display - Enhanced Connection */}
        <div style={{ 
          backgroundColor: "#8e44ad", 
          color: "white",
          padding: "15px", 
          borderRadius: "8px", 
          marginBottom: "20px",
          border: "2px solid #7d3c98"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "white" }}>Booking for:</h4>
          <p style={{ margin: "5px 0", color: "#f8f9fa" }}>
            <strong>Name:</strong> {userInfo.fullName}
          </p>
          <p style={{ margin: "5px 0", color: "#f8f9fa" }}>
            <strong>Mobile:</strong> {userInfo.mobileNumber}
          </p>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontWeight: "bold", 
            color: "#333",
            fontSize: "14px"
          }}>
            When do you need this ride?
          </label>
          <input
            type="time"
            value={rideTime}
            onChange={(e) => setRideTime(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              borderRadius: "5px", 
              border: "1px solid #ccc", 
              fontSize: "16px",
              backgroundColor: "#fff"
            }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "15px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", fontWeight: "bold" }}>
          Request Ride
        </button>
      </form>

      <div style={{ marginTop: "30px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
        {/* Side by side layout for better UI */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* Left side - Check Status */}
          <div style={{ flex: "1", minWidth: "250px", textAlign: "center" }}>
            <p style={{ marginBottom: "10px", color: "#666", fontWeight: "bold" }}>Already booked a ride?</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
              <input
                type="number"
                placeholder="Enter Booking ID"
                style={{ 
                  padding: "10px", 
                  borderRadius: "5px", 
                  border: "1px solid #ccc",
                  width: "140px",
                  fontSize: "14px"
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    setCurrentBookingId(parseInt(e.target.value));
                    setShowStatusModal(true);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const bookingId = e.target.previousElementSibling.value;
                  if (bookingId) {
                    setCurrentBookingId(parseInt(bookingId));
                    setShowStatusModal(true);
                  } else {
                    alert("Please enter a booking ID");
                  }
                }}
                style={{ 
                  padding: "10px 16px", 
                  backgroundColor: "#17a2b8", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px", 
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                Check Status
              </button>
            </div>
          </div>

          {/* Right side - View Booking History */}
          <div style={{ flex: "1", minWidth: "250px", textAlign: "center" }}>
            <p style={{ marginBottom: "10px", color: "#666", fontWeight: "bold" }}>View your confirmed rides:</p>
            <button 
              onClick={() => setShowBookingHistory(true)}
              style={{ 
                padding: "12px 24px", 
                backgroundColor: "#28a745", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                fontSize: "16px",
                cursor: "pointer",
                width: "100%",
                fontWeight: "bold",
                transition: "background-color 0.3s ease"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
            >
              My Accepted Rides
            </button>
          </div>
        </div>
      </div>

      {response && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #28a745", borderRadius: "10px", backgroundColor: "#d4edda" }}>
          <h3 style={{ color: "#155724", textAlign: "center" }}>Booking Created Successfully!</h3>
          <p style={{ textAlign: "center", marginBottom: "15px" }}>
            <strong>Booking ID:</strong> #{response.bookingId}
          </p>
          <p style={{ textAlign: "center", color: "#155724", marginBottom: "10px" }}>
            Your ride request has been sent to drivers. Click below to track your booking status.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setCurrentBookingId(response.bookingId);
                setShowStatusModal(true);
              }}
              style={{
                flex: "1",
                minWidth: "150px",
                padding: "12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Check Status
            </button>
            <button
              onClick={() => setShowBookingHistory(true)}
              style={{
                flex: "1",
                minWidth: "150px",
                padding: "12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              View All Rides
            </button>
          </div>
        </div>
      )}

      {/* Booking Status Modal */}
      <BookingStatus 
        bookingId={currentBookingId} 
        onClose={() => {
          setShowStatusModal(false);
          setCurrentBookingId(null);
        }}
      />

      {/* Booking History Modal */}
      {showBookingHistory && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "10px",
            maxWidth: "900px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowBookingHistory(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
                zIndex: 1001,
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#f0f0f0"}
              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
            >
              ×
            </button>
            
            {/* BookingHistory component */}
            <BookingHistory 
              userInfo={userInfo} 
              refreshTrigger={response?.bookingId} // Refresh when new booking is created
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingForm;
