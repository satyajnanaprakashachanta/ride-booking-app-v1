import React, { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess, onShowRegister, selectedRole }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8081/auth/login", {
        mobileNumber: mobileNumber,
        password: password
      });

      if (response.data.success) {
        // Store user info in localStorage
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        
        onLoginSuccess(response.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "0 auto", 
      padding: "30px", 
      border: "1px solid #ddd", 
      borderRadius: "15px", 
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#333", marginBottom: "10px" }}>Login</h2>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Enter your mobile number and password
        </p>
        {selectedRole && (
          <div style={{
            backgroundColor: selectedRole === "RIDER" ? "#e3f2fd" : "#e8f5e8",
            color: selectedRole === "RIDER" ? "#1976d2" : "#388e3c",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "bold",
            display: "inline-block",
            marginTop: "10px"
          }}>
            {selectedRole === "RIDER" ? "Login as Rider" : "Login as Driver"}
          </div>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "20px",
          border: "1px solid #f5c6cb"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontWeight: "bold", 
            color: "#333" 
          }}>
            Mobile Number *
          </label>
          <input
            type="tel"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              borderRadius: "8px", 
              border: "2px solid #ddd", 
              fontSize: "16px",
              transition: "border-color 0.3s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#007bff"}
            onBlur={(e) => e.target.style.borderColor = "#ddd"}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            fontWeight: "bold", 
            color: "#333" 
          }}>
            Password (4 digits) *
          </label>
          <input
            type="password"
            placeholder="Enter 4-digit password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength="4"
            pattern="[0-9]{4}"
            required
            style={{ 
              width: "100%", 
              padding: "12px", 
              borderRadius: "8px", 
              border: "2px solid #ddd", 
              fontSize: "16px",
              transition: "border-color 0.3s",
              letterSpacing: "2px"
            }}
            onFocus={(e) => e.target.style.borderColor = "#007bff"}
            onBlur={(e) => e.target.style.borderColor = "#ddd"}
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
            borderRadius: "8px", 
            fontSize: "18px", 
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s"
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div style={{ 
        textAlign: "center", 
        marginTop: "25px", 
        paddingTop: "20px", 
        borderTop: "1px solid #eee" 
      }}>
        <p style={{ color: "#666", marginBottom: "10px" }}>
          Don't have an account?
        </p>
        <button 
          onClick={onShowRegister}
          style={{ 
            backgroundColor: "transparent", 
            color: "#007bff", 
            border: "none", 
            fontSize: "16px", 
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}

export default Login;
