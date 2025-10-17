import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

/**
 * Booking Service - Handles all booking-related API calls
 */
class BookingService {
  
  /**
   * Fetch booking history for a specific user or admin
   */
  static async fetchBookingHistory(userInfo, isAdmin) {
    try {
      console.log('BookingService: fetchBookingHistory called with userInfo:', userInfo, 'isAdmin:', isAdmin);
      
      if (isAdmin) {
        console.log('BookingService: Fetching admin booking history from /history/accepted');
        const response = await axios.get(`${API_BASE_URL}/history/accepted`);
        console.log('BookingService: Admin response:', response.data);
        return response.data;
      } else {
        const url = `${API_BASE_URL}/history/user/${userInfo.userId}`;
        console.log('BookingService: Fetching user booking history from:', url);
        const response = await axios.get(url);
        console.log('BookingService: User response:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('BookingService: Error fetching booking history:', error);
      console.error('BookingService: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw new Error('Failed to load booking history');
    }
  }

  /**
   * Fetch booking statistics
   */
  static async fetchBookingStats(userInfo, isAdmin) {
    try {
      if (isAdmin) {
        const response = await axios.get(`${API_BASE_URL}/history/stats`);
        return response.data;
      } else {
        const response = await axios.get(`${API_BASE_URL}/history/user/${userInfo.userId}/stats`);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw new Error('Failed to load booking statistics');
    }
  }

  /**
   * Create a new ride request
   */
  static async createRideRequest(rideData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/rides`, {
        pickupLocation: rideData.pickupLocation,
        dropLocation: rideData.dropLocation,
        distanceInMiles: rideData.distanceInMiles || 5.0,
        estimatedDurationMinutes: 15,
        price: rideData.fare || 15.0,
        status: "PENDING"
      });
      return response.data;
    } catch (error) {
      console.error('Error creating ride request:', error);
      throw new Error('Failed to create ride request');
    }
  }

  /**
   * Create a new booking
   */
  static async createBooking(rideId, userId, bookingData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/${rideId}/${userId}`, 
        bookingData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  }
}

export default BookingService;
