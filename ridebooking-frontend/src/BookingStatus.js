import React, { useState, useEffect } from "react";
import axios from "axios";

function BookingStatus({ bookingId, onClose }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingStatus();
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchBookingStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [bookingId]);

  const fetchBookingStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/bookings/${bookingId}`);
      setBooking(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking status:", error);
      if (error.response && error.response.status === 404) {
        setError("Booking not found. It may have been cancelled or expired.");
      } else {
        setError("Failed to load booking status. Please try again.");
      }
      setLoading(false);
    }
  };

  if (!bookingId) return null;

  if (loading) {
    return (
      <div style={{ 
        position: "fixed", 
        top: "0", 
        left: "0", 
        width: "100%", 
        height: "100%", 
        backgroundColor: "rgba(0,0,0,0.5)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        zIndex: "1000"
      }}>
        <div style={{ 
          backgroundColor: "white", 
          padding: "30px", 
          borderRadius: "10px", 
          textAlign: "center" 
        }}>
          <h3>Loading booking status...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        position: "fixed", 
        top: "0", 
        left: "0", 
        width: "100%", 
        height: "100%", 
        backgroundColor: "rgba(0,0,0,0.5)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        zIndex: "1000"
      }}>
        <div style={{ 
          backgroundColor: "white", 
          padding: "30px", 
          borderRadius: "10px", 
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <h3>❌ {error}</h3>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Booking ID: #{bookingId}
          </p>
          {error.includes("not found") && (
            <div style={{ 
              backgroundColor: "#fff3cd", 
              border: "1px solid #ffeaa7", 
              borderRadius: "5px", 
              padding: "10px", 
              marginBottom: "15px",
              fontSize: "14px",
              color: "#856404"
            }}>
              <strong>Tip:</strong> Bookings are automatically deleted 20 minutes after the scheduled ride time if not accepted by a driver.
            </div>
          )}
          <button 
            onClick={onClose} 
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "REQUESTED": return "#ffc107"; // Yellow
      case "ACCEPTED": return "#28a745";  // Green
      case "REJECTED": return "#dc3545";  // Red
      default: return "#6c757d";          // Gray
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "REQUESTED": return "Pending";
      case "ACCEPTED": return "Accepted";
      case "REJECTED": return "❌";
      default: return "❓";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "REQUESTED": return "Your ride request is pending. Waiting for driver confirmation...";
      case "ACCEPTED": return "Great news! Your ride has been accepted by the driver!";
      case "REJECTED": return "Sorry, your ride request was declined. Please try booking another ride.";
      default: return "Unknown status";
    }
  };

  return (
    <div style={{ 
      position: "fixed", 
      top: "0", 
      left: "0", 
      width: "100%", 
      height: "100%", 
      backgroundColor: "rgba(0,0,0,0.5)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      zIndex: "1000"
    }}>
      <div style={{ 
        backgroundColor: "white", 
        padding: "30px", 
        borderRadius: "15px", 
        maxWidth: "500px", 
        width: "90%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#333", marginBottom: "10px" }}>
            Booking Status Update
          </h2>
          <div style={{ 
            fontSize: "48px", 
            marginBottom: "10px" 
          }}>
            {getStatusIcon(booking.status)}
          </div>
          <div style={{ 
            fontSize: "20px", 
            fontWeight: "bold", 
            color: getStatusColor(booking.status),
            marginBottom: "15px"
          }}>
            {booking.status}
          </div>
          <p style={{ 
            fontSize: "16px", 
            color: "#666", 
            marginBottom: "25px" 
          }}>
            {getStatusMessage(booking.status)}
          </p>
        </div>

        <div style={{ 
          border: "1px solid #ddd", 
          borderRadius: "10px", 
          padding: "20px", 
          marginBottom: "20px",
          backgroundColor: "#f8f9fa"
        }}>
          <h4 style={{ color: "#333", marginTop: "0" }}>Booking Details</h4>
          
          <div style={{ marginBottom: "15px" }}>
            <p><strong>Booking ID:</strong> #{booking.bookingId}</p>
            <p><strong>Your Pickup:</strong> {booking.pickupLocation}</p>
            <p><strong>Your Destination:</strong> {booking.dropLocation}</p>
            {booking.rideTime && (
              <p><strong>Requested Time:</strong> {booking.rideTime}</p>
            )}
            {booking.fare && (
              <p><strong>Fare Amount:</strong> <span style={{ color: "#28a745", fontWeight: "bold" }}>${booking.fare}</span></p>
            )}
            {booking.distanceInMiles && (
              <p><strong>Distance:</strong> {booking.distanceInMiles} miles</p>
            )}
          </div>

          {booking.status === "ACCEPTED" && (
            <div style={{ 
              backgroundColor: "#d4edda", 
              border: "1px solid #c3e6cb", 
              borderRadius: "5px", 
              padding: "15px",
              marginTop: "15px"
            }}>
              <h5 style={{ color: "#155724", marginTop: "0" }}>Your Driver:</h5>
              <p><strong>Name:</strong> {booking.driverName}</p>
              <p><strong>Phone:</strong> {booking.driverPhone}</p>
              <p style={{ 
                fontSize: "14px", 
                color: "#155724", 
                fontStyle: "italic",
                marginBottom: "0"
              }}>
                Your driver will contact you shortly!
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          {booking.status === "REQUESTED" && (
            <p style={{ 
              fontSize: "14px", 
              color: "#666",
              fontStyle: "italic",
              marginBottom: "15px"
            }}>
              This page will automatically update when the driver responds...
            </p>
          )}
          
          <button 
            onClick={onClose}
            style={{ 
              padding: "12px 30px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            {booking.status === "REQUESTED" ? "Keep Checking" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingStatus;
