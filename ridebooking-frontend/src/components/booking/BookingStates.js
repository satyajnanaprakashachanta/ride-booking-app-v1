import React from 'react';

/**
 * Loading state component
 */
export const LoadingState = () => (
  <div style={{ textAlign: "center", padding: "40px" }}>
    <h3>Loading booking history...</h3>
  </div>
);

/**
 * Error state component
 */
export const ErrorState = ({ error, onRetry }) => (
  <div style={{ textAlign: "center", padding: "40px" }}>
    <h3>Error: {error}</h3>
    <button 
      onClick={onRetry}
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

/**
 * Empty state component
 */
export const EmptyState = ({ isAdmin }) => (
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
);
