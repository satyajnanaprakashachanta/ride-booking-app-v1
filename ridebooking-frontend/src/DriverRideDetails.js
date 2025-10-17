import React, { useState, useEffect } from "react";
import axios from "axios";

function DriverRideDetails({ onBack }) {
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo, using Bob Driver (ID=1)
  const driverId = 1;

  useEffect(() => {
    fetchAcceptedBookings();
  }, []);

  const fetchAcceptedBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8081/bookings");
      // Filter bookings that this driver has accepted
      const driverAccepted = response.data.filter(
        booking => booking.status === "ACCEPTED" && 
        booking.ride && booking.ride.driverName === "Bob Driver"
      );
      setAcceptedBookings(driverAccepted);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accepted bookings:", error);
      setError("Failed to load ride details");
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    // If it's in HH:MM format, return as is
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return timeString;
    }
    // If it's a full datetime, extract time
    try {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading ride details...</h2>
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
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>Start Your Rides</h2>
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
          ← Back to Dashboard
        </button>
      </div>

      {acceptedBookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
          <h3>📭 No accepted rides to start</h3>
          <p>Accept some ride requests first, then come back here to see rider details.</p>
        </div>
      ) : (
        <div>
          <h3>Ready to Start - Rider Details ({acceptedBookings.length})</h3>
          {acceptedBookings.map((booking) => (
            <div key={booking.bookingId} style={{ 
              border: "2px solid #007bff", 
              borderRadius: "15px", 
              padding: "25px", 
              marginBottom: "25px", 
              backgroundColor: "#e3f2fd",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3 style={{ color: "#1565c0", marginTop: "0" }}>
                  Ride #{booking.bookingId} - Ready to Start
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
                <div style={{ 
                  backgroundColor: "white", 
                  padding: "20px", 
                  borderRadius: "10px",
                  border: "2px solid #bbdefb"
                }}>
                  <h4 style={{ color: "#1565c0", marginTop: "0", textAlign: "center" }}>
                    Your Passenger
                  </h4>
                  <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
                    <p><strong>Name:</strong> <span style={{ color: "#1565c0", fontSize: "18px" }}>{booking.riderName}</span></p>
                    <p><strong>Phone:</strong> <span style={{ color: "#1565c0", fontSize: "18px" }}>{booking.riderPhone}</span></p>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: "#c8e6c9", 
                    border: "1px solid #a5d6a7", 
                    borderRadius: "8px", 
                    padding: "12px", 
                    marginTop: "15px",
                    textAlign: "center"
                  }}>
                    <strong style={{ color: "#2e7d32", fontSize: "14px" }}>
                      Call before pickup
                    </strong>
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: "white", 
                  padding: "20px", 
                  borderRadius: "10px",
                  border: "2px solid #bbdefb"
                }}>
                  <h4 style={{ color: "#1565c0", marginTop: "0", textAlign: "center" }}>
                    📍 Trip Information
                  </h4>
                  <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
                    <p><strong>Pickup:</strong> <br />
                      <span style={{ color: "#2e7d32", fontSize: "17px", fontWeight: "bold" }}>
                        {booking.pickupLocation}
                      </span>
                    </p>
                    <p><strong>Drop:</strong> <br />
                      <span style={{ color: "#d32f2f", fontSize: "17px", fontWeight: "bold" }}>
                        {booking.dropLocation}
                      </span>
                    </p>
                    <p><strong>Time Needed:</strong> <br />
                      <span style={{ color: "#f57c00", fontSize: "17px", fontWeight: "bold" }}>
                        {formatTime(booking.rideTime)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: "20px",
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #bbdefb"
              }}>
                <h4 style={{ color: "#1565c0", marginTop: "0", textAlign: "center" }}>
                  Your Route Details
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", textAlign: "center" }}>
                  <div>
                    <strong>Distance:</strong><br />
                    <span style={{ color: "#1565c0", fontSize: "18px" }}>{booking.ride?.distanceInMiles} miles</span>
                  </div>
                  <div>
                    <strong>Duration:</strong><br />
                    <span style={{ color: "#1565c0", fontSize: "18px" }}>{booking.ride?.estimatedDurationMinutes} min</span>
                  </div>
                  <div>
                    <strong>Fare:</strong><br />
                    <span style={{ color: "#2e7d32", fontSize: "18px", fontWeight: "bold" }}>${booking.ride?.price}</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: "20px",
                textAlign: "center",
                backgroundColor: "#fff3cd", 
                border: "2px solid #ffc107", 
                borderRadius: "10px", 
                padding: "15px"
              }}>
                <div style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "#856404", fontSize: "16px" }}>
                    Ready to Start This Ride!
                  </strong>
                </div>
                <p style={{ color: "#856404", margin: "5px 0", fontSize: "14px" }}>
                  Contact the passenger and head to pickup location
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverRideDetails;
