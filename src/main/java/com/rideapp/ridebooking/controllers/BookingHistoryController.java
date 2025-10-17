package com.rideapp.ridebooking.controllers;

import com.rideapp.ridebooking.dto.BookingDTO;
import com.rideapp.ridebooking.models.Booking;
import com.rideapp.ridebooking.repositories.BookingRepository;
import com.rideapp.ridebooking.services.BookingHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/history")
public class BookingHistoryController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingHistoryService bookingHistoryService;

    // Get booking history for a specific user
    @GetMapping("/user/{userId}")
    public List<BookingDTO> getUserBookingHistory(@PathVariable Long userId) {
        return bookingRepository.findAll()
                .stream()
                .filter(booking -> booking.getRider().getUserId().equals(userId))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get all accepted bookings (2-day history)
    @GetMapping("/accepted")
    public List<BookingDTO> getAcceptedBookingsHistory() {
        return bookingRepository.findAll()
                .stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.ACCEPTED)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Manual cleanup endpoint for testing
    @PostMapping("/cleanup")
    public String performManualCleanup() {
        return bookingHistoryService.performManualCleanup();
    }

    // Get booking statistics for all users (admin only)
    @GetMapping("/stats")
    public BookingStats getBookingStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        long acceptedCount = allBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.ACCEPTED)
                .count();
                
        long requestedCount = allBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.REQUESTED)
                .count();
                
        long rejectedCount = allBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.REJECTED)
                .count();

        return new BookingStats(allBookings.size(), acceptedCount, requestedCount, rejectedCount);
    }

    // Get booking statistics for a specific user
    @GetMapping("/user/{userId}/stats")
    public BookingStats getUserBookingStats(@PathVariable Long userId) {
        List<Booking> userBookings = bookingRepository.findAll().stream()
                .filter(booking -> booking.getRider().getUserId().equals(userId))
                .collect(Collectors.toList());
        
        long acceptedCount = userBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.ACCEPTED)
                .count();
                
        long requestedCount = userBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.REQUESTED)
                .count();
                
        long rejectedCount = userBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.REJECTED)
                .count();

        return new BookingStats(userBookings.size(), acceptedCount, requestedCount, rejectedCount);
    }

    private BookingDTO mapToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setRideId(booking.getRide().getRideId());
        dto.setRiderId(booking.getRider().getUserId());
        dto.setPickupLocation(booking.getPickupLocation());
        dto.setDropLocation(booking.getDropLocation());
        dto.setRideTime(booking.getRideTime());
        dto.setDistanceInMiles(booking.getDistanceInMiles());
        dto.setFare(booking.getFare());
        dto.setStatus(booking.getStatus().name());
        
        // Set additional user information
        dto.setRiderName(booking.getRider().getName());
        dto.setRiderPhone(booking.getRider().getPhoneNumber());
        dto.setDriverName(booking.getRide().getDriver() != null ? booking.getRide().getDriver().getName() : "Looking for driver...");
        dto.setDriverPhone(booking.getRide().getDriver() != null ? booking.getRide().getDriver().getPhoneNumber() : "N/A");
        
        return dto;
    }

    // Inner class for booking statistics
    public static class BookingStats {
        private int totalBookings;
        private long acceptedBookings;
        private long requestedBookings;
        private long rejectedBookings;

        public BookingStats(int totalBookings, long acceptedBookings, long requestedBookings, long rejectedBookings) {
            this.totalBookings = totalBookings;
            this.acceptedBookings = acceptedBookings;
            this.requestedBookings = requestedBookings;
            this.rejectedBookings = rejectedBookings;
        }

        // Getters
        public int getTotalBookings() { return totalBookings; }
        public long getAcceptedBookings() { return acceptedBookings; }
        public long getRequestedBookings() { return requestedBookings; }
        public long getRejectedBookings() { return rejectedBookings; }
    }
}
