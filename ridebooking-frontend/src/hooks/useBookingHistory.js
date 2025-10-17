import { useState, useEffect, useCallback } from 'react';
import BookingService from '../services/bookingService';

/**
 * Custom hook for managing booking history data and operations
 */
export const useBookingHistory = (userInfo, refreshTrigger) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    rejected: 0
  });

  // Check if current user is admin
  const isAdmin = userInfo && userInfo.mobileNumber === "admin";

  const fetchBookingHistory = useCallback(async () => {
    if (!userInfo || !userInfo.userId) {
      console.log('useBookingHistory: Missing userInfo or userId', userInfo);
      setError("User information not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('useBookingHistory: Fetching booking history for user:', userInfo.userId, 'isAdmin:', isAdmin);
      const bookingData = await BookingService.fetchBookingHistory(userInfo, isAdmin);
      console.log('useBookingHistory: Received booking data:', bookingData);
      setBookings(bookingData);
      setLoading(false);
    } catch (err) {
      console.error('useBookingHistory: Error fetching booking history:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [userInfo, isAdmin]);

  const fetchBookingStats = useCallback(async () => {
    if (!userInfo || !userInfo.userId) return;

    try {
      const statsData = await BookingService.fetchBookingStats(userInfo, isAdmin);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [userInfo, isAdmin]);

  const refreshData = useCallback(() => {
    fetchBookingHistory();
    fetchBookingStats();
  }, [fetchBookingHistory, fetchBookingStats]);

  useEffect(() => {
    if (userInfo && userInfo.userId) {
      refreshData();
    }
  }, [userInfo, refreshTrigger, refreshData]);

  return {
    bookings,
    loading,
    error,
    stats,
    isAdmin,
    refreshData,
    fetchBookingHistory
  };
};
