import React from 'react';
import BookingCard from './BookingCard';
import BookingSectionHeader from './BookingSectionHeader';

/**
 * Past rides section component (ACCEPTED/REJECTED bookings)
 */
const PastRidesSection = ({ bookings, onRebook }) => {
  if (bookings.length === 0) return null;

  return (
    <div>
      <BookingSectionHeader
        title="Past Rides"
        count={bookings.length}
        icon="📚"
        badgeText="HISTORY"
        badgeColor="#17a2b8"
        backgroundColor="#d1ecf1"
        borderColor="#bee5eb"
        textColor="#0c5460"
        description="📖 These are your completed rides. Use 'Book Again' to create identical new bookings."
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

export default PastRidesSection;
