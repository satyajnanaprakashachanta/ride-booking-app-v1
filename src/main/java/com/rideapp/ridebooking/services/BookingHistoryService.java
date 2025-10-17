package com.rideapp.ridebooking.services;

import com.rideapp.ridebooking.models.Booking;
import com.rideapp.ridebooking.models.Ride;
import com.rideapp.ridebooking.repositories.BookingRepository;
import com.rideapp.ridebooking.repositories.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BookingHistoryService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    // Run cleanup every 10 minutes
    @Scheduled(fixedRate = 600000) // 10 minutes = 600,000 milliseconds
    public void performBookingAndRideCleanup() {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("🧹 Running booking and ride cleanup at: " + now);

        cleanupExpiredBookings(now);
        cleanupUnacceptedRides(now);
    }

    private void cleanupExpiredBookings(LocalDateTime now) {
        List<Booking> allBookings = bookingRepository.findAll();
        int deletedBookings = 0;

        for (Booking booking : allBookings) {
            if (shouldDeleteBooking(booking, now)) {
                System.out.println("🗑️ Deleting expired booking: " + booking.getBookingId() + 
                    " (Status: " + booking.getStatus() + ")");
                bookingRepository.delete(booking);
                deletedBookings++;
            }
        }

        if (deletedBookings > 0) {
            System.out.println("✅ Deleted " + deletedBookings + " expired bookings");
        }
    }

    private void cleanupUnacceptedRides(LocalDateTime now) {
        List<Ride> allRides = rideRepository.findAll();
        int deletedRides = 0;

        for (Ride ride : allRides) {
            if (shouldDeleteRide(ride, now)) {
                System.out.println("🗑️ Deleting unaccepted ride: " + ride.getRideId() + 
                    " (No bookings accepted within time limit)");
                rideRepository.delete(ride);
                deletedRides++;
            }
        }

        if (deletedRides > 0) {
            System.out.println("✅ Deleted " + deletedRides + " unaccepted rides");
        }
    }

    private boolean shouldDeleteBooking(Booking booking, LocalDateTime now) {
        if (booking.getStatus() == Booking.BookingStatus.ACCEPTED) {
            // Keep accepted bookings for 2 days from creation
            LocalDateTime expiryTime = booking.getCreatedAt().plusDays(2);
            return now.isAfter(expiryTime);
        } else {
            // Delete unaccepted bookings 20 minutes after ride time
            return isBookingExpiredAfterRideTime(booking, now);
        }
    }

    private boolean shouldDeleteRide(Ride ride, LocalDateTime now) {
        // Check if any booking for this ride was accepted
        List<Booking> rideBookings = bookingRepository.findAll().stream()
            .filter(booking -> booking.getRide().getRideId().equals(ride.getRideId()))
            .toList();

        boolean hasAcceptedBooking = rideBookings.stream()
            .anyMatch(booking -> booking.getStatus() == Booking.BookingStatus.ACCEPTED);

        if (hasAcceptedBooking) {
            // Don't delete rides with accepted bookings
            return false;
        }

        // Delete ride if no bookings were accepted and it's past ride time + 20 minutes
        if (rideBookings.isEmpty()) {
            // No bookings at all - keep the ride (it's available for new bookings)
            return false;
        }

        // Check if all bookings are expired (ride time + 20 minutes passed)
        return rideBookings.stream()
            .allMatch(booking -> isBookingExpiredAfterRideTime(booking, now));
    }

    private boolean isBookingExpiredAfterRideTime(Booking booking, LocalDateTime now) {
        try {
            String rideTimeStr = booking.getRideTime();
            if (rideTimeStr == null || rideTimeStr.trim().isEmpty()) {
                return false;
            }

            // Parse the ride time (format: "HH:mm")
            LocalTime rideTime = LocalTime.parse(rideTimeStr, DateTimeFormatter.ofPattern("HH:mm"));
            
            // Create today's date with the ride time
            LocalDateTime rideDateTime = now.toLocalDate().atTime(rideTime);
            
            // If ride time is in the future today, don't delete
            if (rideDateTime.isAfter(now)) {
                return false;
            }
            
            // If ride time was today but in the past, check if 20 minutes have passed
            LocalDateTime expiryTime = rideDateTime.plusMinutes(20);
            return now.isAfter(expiryTime);
            
        } catch (Exception e) {
            System.out.println("⚠️ Could not parse ride time: " + booking.getRideTime() + " - " + e.getMessage());
            return false;
        }
    }

    // Manual cleanup method for testing
    public String performManualCleanup() {
        LocalDateTime now = LocalDateTime.now();
        performBookingAndRideCleanup();
        return "✅ Manual booking and ride cleanup completed at " + now;
    }
}
