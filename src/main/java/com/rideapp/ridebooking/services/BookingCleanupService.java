package com.rideapp.ridebooking.services;

import com.rideapp.ridebooking.models.Booking;
import com.rideapp.ridebooking.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BookingCleanupService {

    @Autowired
    private BookingRepository bookingRepository;

    // Run every 5 minutes to check for expired bookings
    // @Scheduled(fixedRate = 300000) // 5 minutes = 300,000 milliseconds - DISABLED: Using BookingHistoryService instead
    public void cleanupExpiredBookings() {
        performCleanup();
    }

    // Public method for manual cleanup (useful for testing)
    public void performCleanup() {
        System.out.println("🧹 Running booking cleanup at: " + LocalDateTime.now());
        
        List<Booking> allBookings = bookingRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        
        for (Booking booking : allBookings) {
            if (isBookingExpired(booking, now)) {
                System.out.println("🗑️ Deleting expired booking: " + booking.getBookingId() + 
                                 " (Ride time: " + booking.getRideTime() + ")");
                bookingRepository.delete(booking);
            }
        }
    }

    private boolean isBookingExpired(Booking booking, LocalDateTime now) {
        try {
            String rideTimeStr = booking.getRideTime();
            if (rideTimeStr == null || rideTimeStr.trim().isEmpty()) {
                return false; // Don't delete if no ride time specified
            }

            // Parse the ride time (assuming it's in HH:MM format)
            LocalTime rideTime;
            if (rideTimeStr.matches("\\d{2}:\\d{2}")) {
                // Format: "10:30"
                rideTime = LocalTime.parse(rideTimeStr, DateTimeFormatter.ofPattern("HH:mm"));
            } else {
                // Try to parse as full datetime if it's not just time
                try {
                    LocalDateTime rideDateTime = LocalDateTime.parse(rideTimeStr);
                    // Check if ride time + 20 minutes has passed
                    return now.isAfter(rideDateTime.plusMinutes(20));
                } catch (Exception e) {
                    return false; // Don't delete if we can't parse the time
                }
            }

            // For time-only format, assume it's for today
            LocalDateTime rideDateTime = now.toLocalDate().atTime(rideTime);
            
            // If the ride time is in the future today, don't delete
            if (rideDateTime.isAfter(now)) {
                return false;
            }
            
            // If ride time + 20 minutes has passed, it's expired
            LocalDateTime expiryTime = rideDateTime.plusMinutes(20);
            return now.isAfter(expiryTime);
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing ride time for booking " + booking.getBookingId() + ": " + e.getMessage());
            return false; // Don't delete if we can't parse the time
        }
    }
}
