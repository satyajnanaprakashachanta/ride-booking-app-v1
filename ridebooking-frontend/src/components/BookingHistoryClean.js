import React from 'react';
import { useBookingHistory } from '../hooks/useBookingHistory';
import { useBookingOperations } from '../hooks/useBookingOperations';
import { isActiveBooking, isPastBooking } from '../utils/bookingUtils';

// Component imports
import { LoadingState, ErrorState, EmptyState } from './booking/BookingStates';
import CurrentRidesSection from './booking/CurrentRidesSection';
import PastRidesSection from './booking/PastRidesSection';
import AdminBookingSection from './booking/AdminBookingSection';

/**
 * Main BookingHistory component - Clean and organized
 */
function BookingHistory({ userInfo, refreshTrigger }) {
  // Custom hooks for data and operations
  const {
    bookings,
    loading,
    error,
    isAdmin,
    refreshData,
    fetchBookingHistory
  } = useBookingHistory(userInfo, refreshTrigger);

  const { handleRebookRide } = useBookingOperations(userInfo, refreshData);

  // Early returns for loading and error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchBookingHistory} />;

  // Separate bookings by status for non-admin users
  const currentRides = bookings.filter(isActiveBooking);
  const pastRides = bookings.filter(isPastBooking);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* Header Section */}
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2>
          {isAdmin ? "All Booking History & Statistics" : "My Booking History"}
        </h2>
        <span style={{ 
          color: isAdmin ? "#dc3545" : "#007bff", 
          fontSize: "14px", 
          display: "block", 
          marginTop: "5px" 
        }}>
          {isAdmin 
            ? "Admin Access - Viewing All Users"
            : "View your booking history and status"
          }
        </span>
      </header>
      
      {/* Content Section */}
      {bookings.length === 0 ? (
        <EmptyState isAdmin={isAdmin} />
      ) : (
        <div>
          {isAdmin ? (
            // Admin view - show all bookings
            <AdminBookingSection bookings={bookings} />
          ) : (
            // User view - categorized sections
            <div>
              <CurrentRidesSection 
                bookings={currentRides} 
                onRebook={handleRebookRide} 
              />
              <PastRidesSection 
                bookings={pastRides} 
                onRebook={handleRebookRide} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
