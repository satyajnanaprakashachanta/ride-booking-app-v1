/**
 * Booking utility functions for styling and status management
 */

/**
 * Get status color based on booking status
 */
export const getStatusColor = (status) => {
  const statusColors = {
    "REQUESTED": "#ffc107",
    "ACCEPTED": "#28a745", 
    "REJECTED": "#dc3545"
  };
  return statusColors[status] || "#6c757d";
};

/**
 * Get status icon/text based on booking status
 */
export const getStatusIcon = (status) => {
  const statusIcons = {
    "REQUESTED": "Pending",
    "ACCEPTED": "Accepted",
    "REJECTED": "Rejected"
  };
  return statusIcons[status] || "Unknown";
};

/**
 * Get display title based on booking status
 */
export const getBookingTitle = (status) => {
  const titles = {
    "REQUESTED": "Pending",
    "ACCEPTED": "Completed",
    "REJECTED": "Cancelled"
  };
  return titles[status] || "Unknown";
};

/**
 * Get text color based on booking status
 */
export const getTextColor = (status) => {
  const textColors = {
    "REQUESTED": "#856404",
    "ACCEPTED": "#155724",
    "REJECTED": "#721c24"
  };
  return textColors[status] || "#000";
};

/**
 * Get background color based on booking status
 */
export const getBackgroundColor = (status) => {
  const bgColors = {
    "REQUESTED": "#fff8e1",
    "ACCEPTED": "#d4edda",
    "REJECTED": "#f8d7da"
  };
  return bgColors[status] || "#f8f9fa";
};

/**
 * Check if booking is currently active (waiting for driver)
 */
export const isActiveBooking = (booking) => {
  return booking.status === "REQUESTED";
};

/**
 * Check if booking is completed or historical
 */
export const isPastBooking = (booking) => {
  return booking.status === "ACCEPTED" || booking.status === "REJECTED";
};
