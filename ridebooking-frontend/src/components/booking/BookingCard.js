import React from 'react';
import { 
  getStatusColor, 
  getBookingTitle, 
  getTextColor, 
  getBackgroundColor 
} from '../../utils/bookingUtils';

/**
 * Individual booking card component
 */
const BookingCard = ({ booking, isAdmin, onRebook }) => {
  return (
    <div style={{
      border: `2px solid ${getStatusColor(booking.status)}`,
      borderRadius: "10px",
      padding: "20px",
      backgroundColor: getBackgroundColor(booking.status)
    }}>
      {/* Header Section */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "15px" 
      }}>
        <h4 style={{ 
          margin: "0", 
          color: getTextColor(booking.status) 
        }}>
          {getBookingTitle(booking.status)} Booking #{booking.bookingId}
        </h4>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ 
            padding: "5px 15px", 
            backgroundColor: getStatusColor(booking.status), 
            color: "white", 
            borderRadius: "20px", 
            fontSize: "12px",
            fontWeight: "bold"
          }}>
            {booking.status}
          </span>
          
          {!isAdmin && (
            <button
              onClick={() => onRebook(booking)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold"
              }}
              title="Create a brand new booking with same locations"
            >
              🔄 Book Again
            </button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Trip Details */}
        <div>
          <h5 style={{ 
            color: getTextColor(booking.status), 
            marginBottom: "10px" 
          }}>
            Trip Details
          </h5>
          <div>
            <p><strong>From:</strong> {booking.pickupLocation}</p>
            <p><strong>To:</strong> {booking.dropLocation}</p>
            <p><strong>Time:</strong> {booking.rideTime}</p>
            <p><strong>Distance:</strong> {booking.distanceInMiles} miles</p>
            <p><strong>Fare:</strong> <span style={{ color: "#28a745", fontWeight: "bold" }}>${booking.fare}</span></p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h5 style={{ 
            color: getTextColor(booking.status), 
            marginBottom: "10px" 
          }}>
            Contact Information
          </h5>
          
          {/* Passenger Info */}
          <div style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "12px", 
            borderRadius: "8px",
            marginBottom: "10px"
          }}>
            <strong style={{ color: "#495057" }}>Passenger (Who Booked):</strong><br />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{booking.riderName}</span><br />
            <span style={{ color: "#6c757d" }}>Phone: {booking.riderPhone}</span>
          </div>
          
          {/* Driver Info */}
          {booking.driverName ? (
            <div style={{ 
              backgroundColor: "#d4edda", 
              padding: "12px", 
              borderRadius: "8px",
              border: "1px solid #c3e6cb"
            }}>
              <strong style={{ color: "#155724" }}>Driver (Who Accepted):</strong><br />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>{booking.driverName}</span><br />
              <span style={{ color: "#155724" }}>Phone: {booking.driverPhone}</span>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: booking.status === "REQUESTED" ? "#f8f9fa" : "#f8d7da", 
              padding: "12px", 
              borderRadius: "8px",
              textAlign: "center",
              color: booking.status === "REQUESTED" ? "#6c757d" : "#721c24",
              fontStyle: "italic"
            }}>
              <strong>Driver:</strong><br />
              {booking.status === "REQUESTED" ? "Looking for driver..." : "No driver accepted"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
