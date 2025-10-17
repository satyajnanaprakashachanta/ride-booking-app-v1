import React from 'react';
import BookingCard from './BookingCard';

/**
 * Admin section component - shows all bookings without categorization
 */
const AdminBookingSection = ({ bookings }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {bookings.map((booking) => (
        <BookingCard
          key={booking.bookingId}
          booking={booking}
          isAdmin={true}
          onRebook={() => {}} // Admin doesn't have rebook functionality
        />
      ))}
    </div>
  );
};

export default AdminBookingSection;
