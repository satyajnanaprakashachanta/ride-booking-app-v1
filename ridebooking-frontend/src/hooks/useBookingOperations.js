import { useCallback } from 'react';
import BookingService from '../services/bookingService';
import UserService from '../services/userService';

/**
 * Custom hook for handling booking operations like rebooking
 */
export const useBookingOperations = (userInfo, refreshData) => {

  const handleRebookRide = useCallback(async (originalBooking) => {
    const isCompletedRide = originalBooking.status !== "REQUESTED";
    const statusText = isCompletedRide ? "completed ride" : "booking";
    
    const confirmMessage = `📍 Create New Booking?

From: ${originalBooking.pickupLocation}
To: ${originalBooking.dropLocation}
Fare: $${originalBooking.fare}

🔄 This will create a BRAND NEW booking (not connected to this ${statusText}).
✅ The new booking will start as "REQUESTED" waiting for any driver to accept.
🚗 Perfect for daily commutes or repeat trips!

Create new booking?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Create new ride request
      const selectedRide = await BookingService.createRideRequest({
        pickupLocation: originalBooking.pickupLocation,
        dropLocation: originalBooking.dropLocation,
        distanceInMiles: originalBooking.distanceInMiles,
        fare: originalBooking.fare
      });

      // Find or create rider user
      const riderUser = await UserService.findOrCreateRider(userInfo);

      // Create the new booking
      const newBookingData = {
        pickupLocation: originalBooking.pickupLocation,
        dropLocation: originalBooking.dropLocation,
        rideTime: new Date().toISOString(),
        distanceInMiles: originalBooking.distanceInMiles,
        fare: originalBooking.fare
      };

      const response = await BookingService.createBooking(
        selectedRide.rideId, 
        riderUser.userId, 
        newBookingData
      );

      // Success message
      const successMessage = `🎉 New Booking Created Successfully!

New Booking ID: ${response.bookingId}

Your fresh booking has been created as "REQUESTED" and is waiting for a driver to accept it. This is completely separate from your previous ${statusText} - any available driver can accept it.`;

      alert(successMessage);
      
      // Refresh the data
      refreshData();

    } catch (error) {
      console.error("Error rebooking ride:", error);
      alert("Failed to create new booking. Please try again or create a new booking manually.");
    }
  }, [userInfo, refreshData]);

  return {
    handleRebookRide
  };
};
