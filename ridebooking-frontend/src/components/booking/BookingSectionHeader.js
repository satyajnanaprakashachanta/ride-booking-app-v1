import React from 'react';

/**
 * Section header component for categorizing bookings
 */
const BookingSectionHeader = ({ 
  title, 
  count, 
  icon, 
  badgeText, 
  badgeColor, 
  backgroundColor, 
  borderColor, 
  textColor, 
  description 
}) => {
  return (
    <div style={{
      backgroundColor,
      border: `2px solid ${borderColor}`,
      borderRadius: "10px",
      padding: "15px",
      marginBottom: "20px"
    }}>
      <h3 style={{ 
        margin: "0 0 10px 0", 
        color: textColor,
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        {icon} {title} ({count})
        <span style={{
          backgroundColor: badgeColor,
          color: "white",
          padding: "3px 8px",
          borderRadius: "15px",
          fontSize: "12px",
          fontWeight: "bold"
        }}>
          {badgeText}
        </span>
      </h3>
      <p style={{ margin: "0", fontSize: "14px", color: textColor }}>
        {description}
      </p>
    </div>
  );
};

export default BookingSectionHeader;
