import React, { useState } from "react";
import BookingForm from "./BookingForm";
import DriverDashboard from "./DriverDashboard";
import BookingHistory from "./BookingHistory";
import DriverAcceptedBookings from "./DriverAcceptedBookings";
import AdminDashboard from "./components/AdminDashboard";

function MainDashboard({ userInfo, onLogout }) {
  const isAdmin = userInfo.mobileNumber === "admin";
  const isRider = userInfo.role === "RIDER";
  const isDriver = userInfo.role === "DRIVER";
  const [currentView, setCurrentView] = useState(isAdmin ? "admin-dashboard" : "home"); // "home", "book-ride", "start-driving", "booking-history", "admin-dashboard"
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger for booking history

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    onLogout();
  };

  // Function to refresh booking history (called after successful booking creation)
  const refreshBookingHistory = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Function to handle successful booking creation and automatically show booking history
  const handleBookingSuccess = () => {
    refreshBookingHistory();
    // Automatically switch to booking history after successful booking
    setTimeout(() => {
      setCurrentView("booking-history");
    }, 2000); // 2 second delay to let user see success message
  };

  const renderHome = () => (
    <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ 
        backgroundColor: isAdmin ? "#dc3545" : "#f8f9fa", 
        padding: "30px", 
        borderRadius: "15px", 
        marginBottom: "30px",
        border: "1px solid #dee2e6",
        color: isAdmin ? "white" : "inherit"
      }}>
        <h2 style={{ color: isAdmin ? "white" : "#333", marginBottom: "15px" }}>
          {isAdmin ? "Welcome Admin!" : `Welcome, ${userInfo.fullName}!`}
        </h2>
        <p style={{ color: isAdmin ? "#f8f9fa" : "#666", fontSize: "18px", marginBottom: "20px" }}>
          {isAdmin 
            ? "System administration and user management" 
            : isRider 
              ? "Ready to book your next ride?" 
              : "Ready to start earning as a driver?"
          }
        </p>
        {(isRider || isDriver) && (
          <div style={{
            backgroundColor: isRider ? "#e3f2fd" : "#e8f5e8",
            color: isRider ? "#1976d2" : "#388e3c",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "bold",
            display: "inline-block",
            marginBottom: "10px"
          }}>
            {isRider ? "Rider Account" : "Driver Account"}
          </div>
        )}
        <div style={{ fontSize: "14px", color: isAdmin ? "#f8f9fa" : "#888", marginBottom: "10px" }}>
          {userInfo.mobileNumber} | User ID: {userInfo.userId}
        </div>
      </div>

      {/* Admin Dashboard Button */}
      {isAdmin && (
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setCurrentView("admin-dashboard")}
            style={{
              padding: "30px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              width: "100%"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            Admin Dashboard
            <div style={{ fontSize: "16px", fontWeight: "normal", marginTop: "8px" }}>
              Manage users, monitor rides, view statistics
            </div>
          </button>
        </div>
      )}

      {/* RIDER Features */}
      {isRider && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr",
          gap: "20px",
          maxWidth: "400px", 
          margin: "0 auto",
          marginBottom: "30px"
        }}>
          <button
            onClick={() => setCurrentView("book-ride")}
            style={{
              padding: "30px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            Book a Ride
            <div style={{ fontSize: "14px", fontWeight: "normal", marginTop: "8px" }}>
              Find and book rides
            </div>
          </button>

          <button
            onClick={() => setCurrentView("booking-history")}
            style={{
              padding: "30px 20px",
              backgroundColor: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            Booking History
            <div style={{ fontSize: "14px", fontWeight: "normal", marginTop: "8px" }}>
              View your booking history and status
            </div>
          </button>
        </div>
      )}

      {/* DRIVER Features */}
      {isDriver && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr",
          gap: "20px",
          maxWidth: "400px", 
          margin: "0 auto",
          marginBottom: "30px"
        }}>
          <button
            onClick={() => setCurrentView("start-driving")}
            style={{
              padding: "30px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            Start Driving
            <div style={{ fontSize: "14px", fontWeight: "normal", marginTop: "8px" }}>
              Post rides & accept requests
            </div>
          </button>

          <button
            onClick={() => setCurrentView("driver-accepted-history")}
            style={{
              padding: "30px 20px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            My Accepted Rides
            <div style={{ fontSize: "14px", fontWeight: "normal", marginTop: "8px" }}>
              View accepted rides and customer details
            </div>
          </button>
        </div>
      )}


    </div>
  );

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "30px",
        backgroundColor: "white",
        padding: "15px 30px",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ color: "#333", margin: 0 }}>
          Ride Booking App
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {currentView !== "home" && (isRider || isDriver) && (
            <button
              onClick={() => setCurrentView("home")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Home
            </button>
          )}
          {currentView !== "admin-dashboard" && isAdmin && (
            <button
              onClick={() => setCurrentView("admin-dashboard")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Admin Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      {currentView === "home" && renderHome()}
      
      {currentView === "admin-dashboard" && isAdmin && (
        <AdminDashboard />
      )}
      
      {/* RIDER Views */}
      {currentView === "book-ride" && isRider && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "#333" }}>Book Your Ride</h2>
            <p style={{ color: "#666" }}>Find available rides and book your trip</p>
          </div>
          <BookingForm userInfo={userInfo} onBookingSuccess={handleBookingSuccess} />
        </div>
      )}
      
      {currentView === "booking-history" && isRider && (
        <div>
          <BookingHistory userInfo={userInfo} refreshTrigger={refreshTrigger} />
        </div>
      )}

      {/* DRIVER Views */}
      {currentView === "start-driving" && isDriver && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "#333" }}>Driver Dashboard</h2>
            <p style={{ color: "#666" }}>Post rides and manage booking requests</p>
          </div>
          <DriverDashboard userInfo={userInfo} />
        </div>
      )}
      
      {currentView === "driver-accepted-history" && isDriver && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "#333" }}>My Accepted Rides</h2>
            <p style={{ color: "#666" }}>View your accepted rides and customer details</p>
          </div>
          <DriverAcceptedBookings userInfo={userInfo} />
        </div>
      )}
    </div>
  );
}

export default MainDashboard;
