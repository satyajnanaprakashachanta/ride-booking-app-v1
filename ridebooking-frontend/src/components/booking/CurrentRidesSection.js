import React from 'react';
import BookingCard from './BookingCard';
import BookingSectionHeader from './BookingSectionHeader';

/**
 * Current rides section component (REQUESTED bookings)
 */
const CurrentRidesSection = ({ bookings, onRebook }) => {
  if (bookings.length === 0) return null;

  return (
    <div style={{ marginBottom: "40px" }}>
      <BookingSectionHeader
        title="Current Rides"
        count={bookings.length}
        icon="🚗"
        badgeText="ACTIVE"
        badgeColor="#ffc107"
        backgroundColor="#fff3cd"
        borderColor="#ffc107"
        textColor="#856404"
        description="🔥 These bookings are currently waiting for driver acceptance. You can edit or cancel them."
      />
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.bookingId}
            booking={booking}
            isAdmin={false}
            onRebook={onRebook}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentRidesSection;
