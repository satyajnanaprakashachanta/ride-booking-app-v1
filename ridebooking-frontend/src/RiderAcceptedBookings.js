import React, { useState, useEffect } from "react";
import axios from "axios";

function RiderAcceptedBookings({ onBack }) {
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo, using Alice Rider (ID=3)
  const riderId = 3;

  useEffect(() => {
    fetchAcceptedBookings();
    // Refresh every 10 seconds
    const interval = setInterval(fetchAcceptedBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAcceptedBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8081/bookings");
      // Filter bookings for this rider and only ACCEPTED status
      const riderAccepted = response.data.filter(
        booking => booking.riderId === riderId && booking.status === "ACCEPTED"
      );
      setAcceptedBookings(riderAccepted);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accepted bookings:", error);
      setError("Failed to load your rides");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading your accepted rides...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>❌ {error}</h2>
        <button onClick={fetchAcceptedBookings} style={{ padding: "10px 20px", margin: "10px" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>My Accepted Rides</h2>
        <button 
          onClick={onBack}
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#f44336", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={fetchAcceptedBookings}
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#4CAF50", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </div>

      {acceptedBookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
          <h3>📭 No accepted rides yet</h3>
          <p>When drivers accept your ride requests, they will appear here with driver contact information.</p>
        </div>
      ) : (
        <div>
          <h3>Your Confirmed Rides ({acceptedBookings.length})</h3>
          {acceptedBookings.map((booking) => (
            <div key={booking.bookingId} style={{ 
              border: "2px solid #28a745", 
              borderRadius: "10px", 
              padding: "20px", 
              marginBottom: "20px", 
              backgroundColor: "#d4edda",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3 style={{ color: "#155724", marginTop: "0" }}>
                  Ride Confirmed - Booking #{booking.bookingId}
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ 
                  backgroundColor: "white", 
                  padding: "15px", 
                  borderRadius: "8px",
                  border: "1px solid #c3e6cb"
                }}>
                  <h4 style={{ color: "#155724", marginTop: "0" }}>Your Driver</h4>
                  <p><strong>Name:</strong> {booking.driverName}</p>
                  <p><strong>Phone:</strong> {booking.driverPhone}</p>
                  <div style={{ 
                    backgroundColor: "#d1ecf1", 
                    border: "1px solid #bee5eb", 
                    borderRadius: "5px", 
                    padding: "10px", 
                    marginTop: "10px",
                    textAlign: "center"
                  }}>
                    <small style={{ color: "#0c5460", fontWeight: "bold" }}>
                      Contact your driver for pickup details
                    </small>
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: "white", 
                  padding: "15px", 
                  borderRadius: "8px",
                  border: "1px solid #c3e6cb"
                }}>
                  <h4 style={{ color: "#155724", marginTop: "0" }}>📍 Trip Details</h4>
                  <p><strong>From:</strong> {booking.pickupLocation}</p>
                  <p><strong>To:</strong> {booking.dropLocation}</p>
                  {booking.rideTime && (
                    <p><strong>Time:</strong> {booking.rideTime}</p>
                  )}
                  <p><strong>Price:</strong> ${booking.ride?.price}</p>
                  <p><strong>Distance:</strong> {booking.ride?.distanceInMiles} miles</p>
                </div>
              </div>

              <div style={{ 
                marginTop: "15px",
                textAlign: "center",
                backgroundColor: "#fff3cd", 
                border: "1px solid #ffeaa7", 
                borderRadius: "5px", 
                padding: "10px"
              }}>
                <strong style={{ color: "#856404" }}>
                  Status: Confirmed - Driver will contact you shortly!
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RiderAcceptedBookings;
