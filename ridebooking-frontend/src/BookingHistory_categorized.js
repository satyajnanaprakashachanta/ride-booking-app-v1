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

  const renderBookingCard = (booking) => (
    <div key={booking.bookingId} style={{
      border: `2px solid ${getStatusColor(booking.status)}`,
      borderRadius: "10px",
      padding: "20px",
      backgroundColor: booking.status === "REQUESTED" ? "#fff8e1" : 
                     booking.status === "ACCEPTED" ? "#d4edda" : "#f8d7da"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h4 style={{ 
          margin: "0", 
          color: booking.status === "REQUESTED" ? "#856404" : 
                 booking.status === "ACCEPTED" ? "#155724" : "#721c24"
        }}>
          {booking.status === "REQUESTED" ? "Pending" : 
           booking.status === "ACCEPTED" ? "Completed" : "Cancelled"} Booking #{booking.bookingId}
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
              title="Create a brand new booking with same locations"
            >
              🔄 Book Again
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <h5 style={{ 
            color: booking.status === "REQUESTED" ? "#856404" : 
                   booking.status === "ACCEPTED" ? "#155724" : "#721c24", 
            marginBottom: "10px" 
          }}>Trip Details</h5>
          <div>
            <p><strong>From:</strong> {booking.pickupLocation}</p>
            <p><strong>To:</strong> {booking.dropLocation}</p>
            <p><strong>Time:</strong> {booking.rideTime}</p>
            <p><strong>Distance:</strong> {booking.distanceInMiles} miles</p>
            <p><strong>Fare:</strong> <span style={{ color: "#28a745", fontWeight: "bold" }}>${booking.fare}</span></p>
          </div>
        </div>

        <div>
          <h5 style={{ 
            color: booking.status === "REQUESTED" ? "#856404" : 
                   booking.status === "ACCEPTED" ? "#155724" : "#721c24", 
            marginBottom: "10px" 
          }}>Contact Information</h5>
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

  // Separate bookings by status for non-admin users
  const currentRides = bookings.filter(booking => booking.status === "REQUESTED");
  const pastRides = bookings.filter(booking => booking.status !== "REQUESTED");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        {isAdmin ? "All Booking History & Statistics" : "My Booking History"}
        {isAdmin && <span style={{ color: "#dc3545", fontSize: "14px", display: "block", marginTop: "5px" }}>Admin Access - Viewing All Users</span>}
        {!isAdmin && <span style={{ color: "#007bff", fontSize: "14px", display: "block", marginTop: "5px" }}>View your booking history and status</span>}
      </h2>
      
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
        <div>
          {/* For Admin - Show all bookings in one section */}
          {isAdmin ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {bookings.map(renderBookingCard)}
            </div>
          ) : (
            <div>
              {/* Current Rides Section (REQUESTED) */}
              {currentRides.length > 0 && (
                <div style={{ marginBottom: "40px" }}>
                  <div style={{
                    backgroundColor: "#fff3cd",
                    border: "2px solid #ffc107",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "20px"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 10px 0", 
                      color: "#856404",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      🚗 Current Rides ({currentRides.length})
                      <span style={{
                        backgroundColor: "#ffc107",
                        color: "white",
                        padding: "3px 8px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        ACTIVE
                      </span>
                    </h3>
                    <p style={{ margin: "0", fontSize: "14px", color: "#856404" }}>
                      🔥 These bookings are currently waiting for driver acceptance. You can edit or cancel them.
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {currentRides.map(renderBookingCard)}
                  </div>
                </div>
              )}

              {/* Past Rides Section (ACCEPTED/REJECTED) */}
              {pastRides.length > 0 && (
                <div>
                  <div style={{
                    backgroundColor: "#d1ecf1",
                    border: "2px solid #bee5eb",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "20px"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 10px 0", 
                      color: "#0c5460",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      📚 Past Rides ({pastRides.length})
                      <span style={{
                        backgroundColor: "#17a2b8",
                        color: "white",
                        padding: "3px 8px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        HISTORY
                      </span>
                    </h3>
                    <p style={{ margin: "0", fontSize: "14px", color: "#0c5460" }}>
                      📖 These are your completed rides. Use "Book Again" to create identical new bookings.
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {pastRides.map(renderBookingCard)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
