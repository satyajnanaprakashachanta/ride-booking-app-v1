import React, { useState } from "react";
import axios from "axios";

function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the authentication system
      const authResponse = await axios.post("http://localhost:8081/auth/login", {
        mobileNumber: username,
        password: password
      });

      if (authResponse.data.success) {
        // Check if user is admin by getting user details
        const usersResponse = await axios.get("http://localhost:8081/users");
        const admin = usersResponse.data.find(user => 
          user.phoneNumber === username && user.role === "ADMIN"
        );

        if (admin) {
          // Successfully authenticated as admin
          onLoginSuccess({
            ...admin,
            authUserId: authResponse.data.userId,
            fullName: authResponse.data.fullName
          });
        } else {
          throw new Error("Access denied. Admin privileges required.");
        }
      } else {
        throw new Error(authResponse.data.message || "Authentication failed");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Invalid username or password. Use 'admin' / '9010'");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f8f9fa"
    }}>
      <div style={{ 
        maxWidth: "400px", 
        width: "100%", 
        padding: "40px", 
        backgroundColor: "white", 
        borderRadius: "10px", 
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        border: "1px solid #ddd"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ color: "#343a40", marginBottom: "10px" }}>🔐 Admin Login</h2>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Access the ride booking management system
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ 
              backgroundColor: "#f8d7da", 
              color: "#721c24", 
              padding: "10px", 
              borderRadius: "5px", 
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold", 
              color: "#333" 
            }}>
              Username:
            </label>
            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ 
                width: "100%", 
                padding: "12px", 
                borderRadius: "5px", 
                border: "1px solid #ccc", 
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold", 
              color: "#333" 
            }}>
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: "100%", 
                padding: "12px", 
                borderRadius: "5px", 
                border: "1px solid #ccc", 
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: loading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </button>
        </form>

        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: "#e9ecef", 
          borderRadius: "5px",
          fontSize: "12px",
          color: "#666"
        }}>
          <strong>Admin Credentials:</strong><br />
          Username: admin<br />
          Password: 9010
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
