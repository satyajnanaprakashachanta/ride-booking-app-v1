import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import MainDashboard from "./MainDashboard";

function App() {
  const [currentView, setCurrentView] = useState("roleSelection"); // "roleSelection", "login", "register", "dashboard"
  const [userInfo, setUserInfo] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // "RIDER" or "DRIVER"
  const [loading, setLoading] = useState(true);

  // Check for existing login on app start
  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo);
        setUserInfo(parsedUserInfo);
        setCurrentView("dashboard");
      } catch (error) {
        console.error("Error parsing saved user info:", error);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userId");
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUserInfo(userData);
        setCurrentView("dashboard");
  };

  const handleRegistrationSuccess = (userData) => {
    // Show success message and redirect to login
    alert(`Account created successfully! Welcome ${userData.fullName}. Please login to continue.`);
    setCurrentView("login");
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setCurrentView("login");
  };

  const handleLogout = () => {
    setUserInfo(null);
    setSelectedRole(null);
    setCurrentView("roleSelection");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userId");
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        backgroundColor: "#f5f5f5" 
      }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#333" }}>Loading...</h2>
          <p style={{ color: "#666" }}>Please wait while we get things ready</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {currentView === "roleSelection" && (
        <div style={{ padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h1 style={{ color: "#333", fontSize: "42px", marginBottom: "15px" }}>
              Ride Booking App
            </h1>
            <p style={{ color: "#666", fontSize: "20px", marginBottom: "30px" }}>
              Choose how you want to get started
            </p>
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "40px", 
            flexWrap: "wrap",
            maxWidth: "800px",
            margin: "0 auto"
          }}>
            {/* Book a Ride Button */}
            <div 
              onClick={() => handleRoleSelection("RIDER")}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "40px 30px",
                borderRadius: "20px",
                cursor: "pointer",
                textAlign: "center",
                minWidth: "300px",
                boxShadow: "0 8px 20px rgba(0,123,255,0.3)",
                transition: "all 0.3s ease",
                border: "none"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 12px 25px rgba(0,123,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(0,123,255,0.3)";
              }}
            >
              <h2 style={{ fontSize: "28px", marginBottom: "15px", fontWeight: "bold" }}>
                Book a Ride
              </h2>
              <p style={{ fontSize: "18px", opacity: 0.9, lineHeight: "1.5" }}>
                Need to get somewhere? Find a ride quickly and safely to your destination.
              </p>
            </div>

            {/* Start Driving Button */}
            <div 
              onClick={() => handleRoleSelection("DRIVER")}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "40px 30px",
                borderRadius: "20px",
                cursor: "pointer",
                textAlign: "center",
                minWidth: "300px",
                boxShadow: "0 8px 20px rgba(40,167,69,0.3)",
                transition: "all 0.3s ease",
                border: "none"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 12px 25px rgba(40,167,69,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(40,167,69,0.3)";
              }}
            >
              <h2 style={{ fontSize: "28px", marginBottom: "15px", fontWeight: "bold" }}>
                Start Driving
              </h2>
              <p style={{ fontSize: "18px", opacity: 0.9, lineHeight: "1.5" }}>
                Earn money by giving rides. Set your own schedule and be your own boss.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p style={{ color: "#888", fontSize: "16px" }}>
              Safe, reliable transportation at your fingertips
            </p>
          </div>
        </div>
      )}

      {currentView === "login" && (
        <div style={{ padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ color: "#333", fontSize: "36px", marginBottom: "10px" }}>
              {selectedRole === "RIDER" ? "Book a Ride" : "Start Driving"}
            </h1>
            <p style={{ color: "#666", fontSize: "18px" }}>
              {selectedRole === "RIDER" 
                ? "Login to book your ride" 
                : "Login to start earning as a driver"
              }
            </p>
            <button 
              onClick={() => setCurrentView("roleSelection")}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
                marginTop: "10px"
              }}
            >
              ← Back to role selection
            </button>
          </div>
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onShowRegister={() => setCurrentView("register")}
            selectedRole={selectedRole}
          />
        </div>
      )}

      {currentView === "register" && (
        <div style={{ padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ color: "#333", fontSize: "36px", marginBottom: "10px" }}>
              {selectedRole === "RIDER" ? "Join as Rider" : "Join as Driver"}
            </h1>
            <p style={{ color: "#666", fontSize: "18px" }}>
              {selectedRole === "RIDER" 
                ? "Create account to start booking rides" 
                : "Create account to start earning as a driver"
              }
            </p>
            <button 
              onClick={() => setCurrentView("roleSelection")}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
                marginTop: "10px"
              }}
            >
              ← Back to role selection
            </button>
          </div>
          <Register 
            onRegistrationSuccess={handleRegistrationSuccess} 
            onShowLogin={() => setCurrentView("login")}
            selectedRole={selectedRole}
          />
        </div>
      )}

      {currentView === "dashboard" && userInfo && (
        <MainDashboard 
          userInfo={userInfo} 
          onLogout={handleLogout} 
        />
      )}

    </div>
  );
}

export default App;
