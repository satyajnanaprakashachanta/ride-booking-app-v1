import React, { useState, useEffect } from "react";
import axios from "axios";

function BookingHistory({ userInfo, refreshTrigger }) {
  console.log('BookingHistory component loaded with userInfo:', userInfo);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    rideTime: '',
    fare: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    rejected: 0
  });
  
  // Check if current user is admin
  const isAdmin = userInfo && userInfo.mobileNumber === "admin";

  useEffect(() => {
    console.log('BookingHistory useEffect - userInfo:', userInfo);
    console.log('BookingHistory useEffect - userInfo.userId:', userInfo?.userId);
    if (userInfo && userInfo.userId) {
      fetchBookingHistory();
      fetchBookingStats();
    } else {
      console.log('BookingHistory - userInfo or userId missing, not fetching data');
    }
  }, [userInfo, refreshTrigger]);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!userInfo) {
        console.error('No userInfo provided to BookingHistory component');
        setError("User information not available");
        setLoading(false);
        return;
      }
      
      if (!userInfo.userId) {
        console.error('No userId in userInfo:', userInfo);
        setError("User ID not available");
        setLoading(false);
        return;
      }
      
      if (isAdmin) {
        const response = await axios.get("http://localhost:8081/history/accepted");
        setBookings(response.data);
      } else {
        const url = `http://localhost:8081/history/user/${userInfo.userId}`;
        const response = await axios.get(url);
        setBookings(response.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      setError("Failed to load booking history");
      setLoading(false);
    }
  };

  const fetchBookingStats = async () => {
    try {
      if (isAdmin) {
        const response = await axios.get("http://localhost:8081/history/stats");
        setStats(response.data);
      } else {
        const response = await axios.get(`http://localhost:8081/history/user/${userInfo.userId}/stats`);
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching booking stats:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "REQUESTED": return "#ffc107";
      case "ACCEPTED": return "#28a745";
      case "REJECTED": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "REQUESTED": return "Pending";
      case "ACCEPTED": return "Accepted";
      case "REJECTED": return "Rejected";
      default: return "Unknown";
    }
  };

  const handleRebookRide = async (originalBooking) => {
    const isCompletedRide = originalBooking.status !== "REQUESTED";
    const statusText = isCompletedRide ? "completed ride" : "booking";
    
    if (window.confirm(`📍 Create New Booking?\n\nFrom: ${originalBooking.pickupLocation}\nTo: ${originalBooking.dropLocation}\nFare: $${originalBooking.fare}\n\n🔄 This will create a BRAND NEW booking (not connected to this ${statusText}).\n✅ The new booking will start as "REQUESTED" waiting for any driver to accept.\n🚗 Perfect for daily commutes or repeat trips!\n\nCreate new booking?`)) {
      try {
        // Always create a new ride request for rebooking to ensure it's fresh
        const newRideResponse = await axios.post("http://localhost:8081/rides", {
          pickupLocation: originalBooking.pickupLocation,
          dropLocation: originalBooking.dropLocation,
          distanceInMiles: originalBooking.distanceInMiles || 5.0,
          estimatedDurationMinutes: 15,
          price: originalBooking.fare || 15.0,
          status: "PENDING"
        });
        const selectedRide = newRideResponse.data;

        // Find the rider user
        const usersResponse = await axios.get("http://localhost:8081/users");
        let riderUser = usersResponse.data.find(user => 
          user.name === userInfo.fullName && user.role === "RIDER"
        );
        
        if (!riderUser) {
          const newUserResponse = await axios.post("http://localhost:8081/users", {
            name: userInfo.fullName,
            phoneNumber: userInfo.mobileNumber,
            email: `${userInfo.fullName.toLowerCase().replace(/\s+/g, '')}@rider.com`,
            role: "RIDER",
            status: "ACTIVE"
          });
          riderUser = newUserResponse.data;
        }

        // Create the new booking with current time
        const newBookingData = {
          pickupLocation: originalBooking.pickupLocation,
          dropLocation: originalBooking.dropLocation,
          rideTime: new Date().toISOString(),
          distanceInMiles: originalBooking.distanceInMiles,
          fare: originalBooking.fare
        };

        const response = await axios.post(`http://localhost:8081/bookings/${selectedRide.rideId}/${riderUser.userId}`, newBookingData);
        
        if (response.status === 200 || response.status === 201) {
          alert(`🎉 New Booking Created Successfully!\n\nNew Booking ID: ${response.data.bookingId}\n\nYour fresh booking has been created as "REQUESTED" and is waiting for a driver to accept it. This is completely separate from your previous ${statusText} - any available driver can accept it.`);
          
          fetchBookingHistory();
          fetchBookingStats();
        }
      } catch (error) {
        console.error("Error rebooking ride:", error);
        alert("Failed to create new booking. Please try again or create a new booking manually.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h3>Loading booking history...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h3>Error: {error}</h3>
        <button 
          onClick={fetchBookingHistory}
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#007bff",
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        {isAdmin ? "All Booking History & Statistics" : "My Booking History"}
        {isAdmin && <span style={{ color: "#dc3545", fontSize: "14px", display: "block", marginTop: "5px" }}>Admin Access - Viewing All Users</span>}
        {!isAdmin && <span style={{ color: "#007bff", fontSize: "14px", display: "block", marginTop: "5px" }}>View your booking history and status</span>}
      </h2>
      
      {/* Enhanced Info message for riders */}
      {!isAdmin && (
        <div style={{
          backgroundColor: "#e3f2fd",
          border: "1px solid #2196f3",
          borderRadius: "5px",
          padding: "15px",
          marginBottom: "30px",
          fontSize: "14px",
          color: "#1976d2"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>📋 Your Booking Management Center</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px" }}>
            <div>
              <strong>🟡 Active Bookings (REQUESTED):</strong>
              <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "13px" }}>
                <li>Waiting for driver acceptance</li>
                <li>You can edit or cancel these</li>
                <li>Real-time status updates</li>
              </ul>
            </div>
            <div>
              <strong>📚 Past Rides (ACCEPTED/REJECTED):</strong>
              <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "13px" }}>
                <li>Completed bookings (historical)</li>
                <li>Use "Book Again" for new booking</li>
                <li>Perfect for daily commutes</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Display bookings with enhanced visual separation */}
      {bookings.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "10px",
          border: "1px solid #dee2e6"
        }}>
          <h4>{isAdmin ? "No accepted bookings found" : "No bookings found"}</h4>
          <p>
            {isAdmin 
              ? "Accepted bookings are kept for 2 days and will appear here." 
              : "Your booking history will appear here after you book rides."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {bookings.map((booking) => (
            <div key={booking.bookingId} style={{ position: "relative" }}>
              {/* Status indicator badges */}
              {booking.status === "REQUESTED" && !isAdmin && (
                <div style={{
                  position: "absolute",
                  top: "-8px",
                  right: "15px",
                  backgroundColor: "#ff9800",
                  color: "white",
                  padding: "3px 10px",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  zIndex: 1,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                  🔥 ACTIVE
                </div>
              )}
              
              {booking.status !== "REQUESTED" && !isAdmin && (
                <div style={{
                  position: "absolute",
                  top: "-8px",
                  right: "15px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  padding: "3px 10px",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  zIndex: 1,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                  📚 PAST
                </div>
              )}

              <div
                style={{
                  border: `2px solid ${booking.status === "REQUESTED" ? "#ff9800" : "#28a745"}`,
                  borderRadius: "10px",
                  padding: "20px",
                  backgroundColor: booking.status === "REQUESTED" ? "#fff8e1" : "#d4edda",
                  opacity: booking.status === "REQUESTED" ? "1" : "0.9"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h4 style={{ margin: "0", color: "#155724" }}>
                    {getStatusIcon(booking.status)} Booking #{booking.bookingId}
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
                    
                    {/* Book Again button - Show for all bookings for non-admin users */}
                    {!isAdmin && (
                      <button
                        onClick={() => handleRebookRide(booking)}
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
                        title={`Create a brand new booking with same locations (independent from this ${booking.status === "REQUESTED" ? "active booking" : "completed ride"})`}
                      >
                        🔄 Book Again
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Trip Details */}
                  <div>
                    <h5 style={{ color: "#155724", marginBottom: "10px" }}>Trip Details</h5>
                    <div>
                      <p><strong>From:</strong> {booking.pickupLocation}</p>
                      <p><strong>To:</strong> {booking.dropLocation}</p>
                      <p><strong>Time:</strong> {booking.rideTime}</p>
                      <p><strong>Distance:</strong> {booking.distanceInMiles} miles</p>
                      <p><strong>Fare:</strong> <span style={{ color: "#28a745", fontWeight: "bold" }}>${booking.fare}</span></p>
                    </div>
                  </div>

                  {/* People Details */}
                  <div>
                    <h5 style={{ color: "#155724", marginBottom: "10px" }}>Contact Information</h5>
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
                    {booking.driverName && (
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
