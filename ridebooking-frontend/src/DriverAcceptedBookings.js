import React, { useState, useEffect } from "react";
import axios from "axios";

function DriverAcceptedBookings({ userInfo }) {
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userInfo && userInfo.userId) {
      fetchAcceptedBookings();
    } else {
      console.log('DriverAcceptedBookings - userInfo not available:', userInfo);
      setError("User information not available. Please login again.");
      setLoading(false);
    }
  }, [userInfo?.userId]);

  const fetchAcceptedBookings = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log('Fetching accepted bookings for driver:', userInfo.userId);
      
      // Fetch bookings that this driver has accepted
      const response = await axios.get(`http://localhost:8081/bookings/drivers/${userInfo.userId}/accepted`);
      
      console.log('Accepted bookings response:', response.data);
      setAcceptedBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching accepted bookings:", error);
      
      // If it's a 404 or the user doesn't exist, just show empty state instead of error
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        console.log('No accepted bookings found or user not found, showing empty state');
        setAcceptedBookings([]);
        setError(""); // Clear error for empty state
      } else {
        setError("Failed to load accepted bookings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString();
    } catch (error) {
      return dateTimeString;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>Loading accepted bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          padding: "15px", 
          borderRadius: "5px",
          border: "1px solid #f5c6cb",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          {error}
        </div>
        <button 
          onClick={fetchAcceptedBookings}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Statistics */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "20px", 
        marginBottom: "30px" 
      }}>
        <div style={{
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#28a745", margin: "0 0 10px 0", fontSize: "32px" }}>
            {acceptedBookings.length}
          </h3>
          <p style={{ color: "#155724", margin: 0, fontWeight: "bold" }}>
            Total Accepted Rides
          </p>
        </div>
        
        <div style={{
          backgroundColor: "#e2e3e5",
          border: "1px solid #d6d8db",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#6c757d", margin: "0 0 10px 0", fontSize: "32px" }}>
            ${acceptedBookings.reduce((total, booking) => total + (booking.fare || 0), 0).toFixed(2)}
          </h3>
          <p style={{ color: "#495057", margin: 0, fontWeight: "bold" }}>
            Total Earnings
          </p>
        </div>
      </div>

      {/* Accepted Bookings List */}
      {acceptedBookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h3 style={{ color: "#333", marginBottom: "10px" }}>No Accepted Rides Yet</h3>
          <p style={{ color: "#666" }}>
            Start accepting ride requests to see them here with customer details.
          </p>
        </div>
      ) : (
        <div>
          <h3 style={{ color: "#333", marginBottom: "20px" }}>My Accepted Rides ({acceptedBookings.length})</h3>
          
          <div style={{ display: "grid", gap: "20px" }}>
            {acceptedBookings.map((booking, index) => (
              <div 
                key={booking.bookingId || index}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #dee2e6",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Trip Details */}
                  <div>
                    <h4 style={{ color: "#28a745", margin: "0 0 15px 0", display: "flex", alignItems: "center" }}>
                      <span style={{ backgroundColor: "#28a745", color: "white", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", marginRight: "10px" }}>
                        ACCEPTED
                      </span>
                      Ride #{booking.bookingId}
                    </h4>
                    
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#333" }}>Pickup:</strong>
                      <div style={{ color: "#666", marginLeft: "20px" }}>{booking.pickupLocation}</div>
                    </div>
                    
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#333" }}>Drop-off:</strong>
                      <div style={{ color: "#666", marginLeft: "20px" }}>{booking.dropLocation}</div>
                    </div>
                    
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#333" }}>Time:</strong>
                      <span style={{ color: "#666", marginLeft: "10px" }}>{booking.rideTime}</span>
                    </div>
                    
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#333" }}>Distance:</strong>
                      <span style={{ color: "#666", marginLeft: "10px" }}>{booking.distanceInMiles} miles</span>
                    </div>
                    
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#28a745" }}>Fare:</strong>
                      <span style={{ color: "#28a745", marginLeft: "10px", fontSize: "18px", fontWeight: "bold" }}>
                        ${booking.fare}
                      </span>
                    </div>
                  </div>
                  
                  {/* Rider Details */}
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef"
                  }}>
                    <h5 style={{ color: "#333", margin: "0 0 15px 0" }}>Customer Information</h5>
                    
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#333" }}>Name:</strong>
                      <div style={{ color: "#666", fontSize: "16px", fontWeight: "bold" }}>
                        {booking.riderName}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "15px" }}>
                      <strong style={{ color: "#333" }}>Phone:</strong>
                      <div style={{ color: "#007bff", fontSize: "16px", fontWeight: "bold" }}>
                        {booking.riderPhone}
                      </div>
                    </div>
                    
                    <div style={{
                      backgroundColor: "#d1ecf1",
                      border: "1px solid #bee5eb",
                      padding: "10px",
                      borderRadius: "5px",
                      fontSize: "14px",
                      color: "#0c5460"
                    }}>
                      <strong>Contact Customer:</strong><br/>
                      Call or text the customer to coordinate pickup details and arrival time.
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button 
          onClick={fetchAcceptedBookings}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default DriverAcceptedBookings;
