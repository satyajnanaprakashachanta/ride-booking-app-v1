package com.rideapp.ridebooking.controllers;

import com.rideapp.ridebooking.models.User;
import com.rideapp.ridebooking.models.Ride;
import com.rideapp.ridebooking.models.Booking;
import com.rideapp.ridebooking.repositories.UserRepository;
import com.rideapp.ridebooking.repositories.RideRepository;
import com.rideapp.ridebooking.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RideRepository rideRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    // Check admin token
    private boolean isValidAdmin(String token) {
        return "admin".equals(token);
    }

    // 📊 Get all ride activities for admin dashboard
    @GetMapping("/rides")
    public List<Map<String, Object>> getAllRideActivities(@RequestHeader("Admin-Token") String token) {
        if (!isValidAdmin(token)) {
            throw new RuntimeException("❌ Access denied. Admin privileges required.");
        }

        return rideRepository.findAll().stream().map(ride -> {
            Map<String, Object> rideActivity = new HashMap<>();
            rideActivity.put("rideId", ride.getRideId());
            rideActivity.put("pickupLocation", ride.getPickupLocation());
            rideActivity.put("dropLocation", ride.getDropLocation());
            rideActivity.put("price", ride.getPrice());
            rideActivity.put("distanceInMiles", ride.getDistanceInMiles());
            rideActivity.put("estimatedDurationMinutes", ride.getEstimatedDurationMinutes());
            rideActivity.put("status", ride.getStatus().toString());
            rideActivity.put("rideTime", ride.getTime());
            rideActivity.put("driverName", ride.getDriver() != null ? ride.getDriver().getName() : "No driver assigned");
            rideActivity.put("driverId", ride.getDriver() != null ? ride.getDriver().getUserId() : null);
            
            // Get all bookings for this ride
            List<Booking> bookings = bookingRepository.findByRide(ride);
            List<Map<String, Object>> bookingDetails = bookings.stream().map(booking -> {
                Map<String, Object> bookingInfo = new HashMap<>();
                bookingInfo.put("bookingId", booking.getBookingId());
                bookingInfo.put("passengerName", booking.getRider().getName());
                bookingInfo.put("passengerId", booking.getRider().getUserId());
                bookingInfo.put("passengerPhone", booking.getRider().getPhoneNumber());
                bookingInfo.put("status", booking.getStatus().toString());
                bookingInfo.put("rideTime", booking.getRideTime());
                bookingInfo.put("createdAt", booking.getCreatedAt());
                bookingInfo.put("customFare", booking.getFare());
                bookingInfo.put("customDistance", booking.getDistanceInMiles());
                return bookingInfo;
            }).collect(Collectors.toList());
            
            rideActivity.put("bookings", bookingDetails);
            rideActivity.put("totalBookings", bookings.size());
            
            return rideActivity;
        }).collect(Collectors.toList());
    }

    // 👥 Get all users for admin management
    @GetMapping("/users")
    public List<Map<String, Object>> getAllUsers(@RequestHeader("Admin-Token") String token) {
        if (!isValidAdmin(token)) {
            throw new RuntimeException("❌ Access denied. Admin privileges required.");
        }

        return userRepository.findAll().stream()
                .filter(user -> !"admin".equals(user.getPhoneNumber())) // Don't show admin user
                .map(user -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("userId", user.getUserId());
                    userInfo.put("name", user.getName());
                    userInfo.put("phoneNumber", user.getPhoneNumber());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("role", user.getRole().toString());
                    userInfo.put("status", user.getStatus().toString());
                    
                    // Count user's rides and bookings
                    long ridesAsDriver = rideRepository.findByDriver(user).size();
                    long bookingsAsPassenger = bookingRepository.findByRider(user).size();
                    
                    userInfo.put("totalRidesAsDriver", ridesAsDriver);
                    userInfo.put("totalBookingsAsPassenger", bookingsAsPassenger);
                    
                    return userInfo;
                }).collect(Collectors.toList());
    }

    // 🚫 Block/Unblock user
    @PutMapping("/users/{userId}/status")
    public Map<String, String> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam String status,
            @RequestHeader("Admin-Token") String token) {
        
        if (!isValidAdmin(token)) {
            throw new RuntimeException("❌ Access denied. Admin privileges required.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't allow blocking admin user
        if ("admin".equals(user.getPhoneNumber())) {
            throw new RuntimeException("❌ Cannot modify admin user status");
        }

        try {
            User.Status newStatus = User.Status.valueOf(status.toUpperCase());
            user.setStatus(newStatus);
            userRepository.save(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "✅ User status updated successfully");
            response.put("userId", userId.toString());
            response.put("userName", user.getName());
            response.put("newStatus", newStatus.toString());
            return response;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("❌ Invalid status. Use: ACTIVE or BLOCKED");
        }
    }

    // 🗑️ Delete user and all related data
    @DeleteMapping("/users/{userId}")
    public Map<String, String> deleteUser(
            @PathVariable Long userId,
            @RequestHeader("Admin-Token") String token) {
        
        if (!isValidAdmin(token)) {
            throw new RuntimeException("❌ Access denied. Admin privileges required.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't allow deleting admin user
        if ("admin".equals(user.getPhoneNumber())) {
            throw new RuntimeException("❌ Cannot delete admin user");
        }

        String userName = user.getName();
        
        // Delete all bookings by this user
        List<Booking> userBookings = bookingRepository.findByRider(user);
        bookingRepository.deleteAll(userBookings);
        
        // Delete all rides by this user
        List<Ride> userRides = rideRepository.findByDriver(user);
        rideRepository.deleteAll(userRides);
        
        // Delete the user
        userRepository.delete(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ User and all related data deleted successfully");
        response.put("deletedUser", userName);
        response.put("deletedBookings", String.valueOf(userBookings.size()));
        response.put("deletedRides", String.valueOf(userRides.size()));
        return response;
    }

    // 📈 Get dashboard statistics
    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats(@RequestHeader("Admin-Token") String token) {
        if (!isValidAdmin(token)) {
            throw new RuntimeException("❌ Access denied. Admin privileges required.");
        }

        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count() - 1; // Exclude admin
        long activeUsers = userRepository.findAll().stream()
                .filter(user -> !"admin".equals(user.getPhoneNumber()))
                .filter(user -> user.getStatus() == User.Status.ACTIVE)
                .count();
        long blockedUsers = totalUsers - activeUsers;
        
        // Ride statistics
        long totalRides = rideRepository.count();
        long pendingRides = rideRepository.findAll().stream()
                .filter(ride -> ride.getStatus() == Ride.RideStatus.PENDING)
                .count();
        long completedRides = rideRepository.findAll().stream()
                .filter(ride -> ride.getStatus() == Ride.RideStatus.COMPLETED)
                .count();
        
        // Booking statistics
        long totalBookings = bookingRepository.count();
        long acceptedBookings = bookingRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.ACCEPTED)
                .count();
        long pendingBookings = bookingRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.REQUESTED)
                .count();
        
        stats.put("users", Map.of(
                "total", totalUsers,
                "active", activeUsers,
                "blocked", blockedUsers
        ));
        
        stats.put("rides", Map.of(
                "total", totalRides,
                "pending", pendingRides,
                "completed", completedRides
        ));
        
        stats.put("bookings", Map.of(
                "total", totalBookings,
                "accepted", acceptedBookings,
                "pending", pendingBookings
        ));
        
        return stats;
    }

    // 🚨 Get suspicious activities (self-bookings, rapid bookings, etc.)
    @GetMapping("/suspicious-activities")
    public List<Map<String, Object>> getSuspiciousActivities(@RequestHeader("Admin-Token") String token) {
        if (!isValidAdmin(token)) {
            throw new RuntimeException("❌ Access denied. Admin privileges required.");
        }

        List<Map<String, Object>> suspiciousActivities = new java.util.ArrayList<>();
        
        // Find self-bookings (rider and driver are the same person)
        List<Booking> allBookings = bookingRepository.findAll();
        
        for (Booking booking : allBookings) {
            Ride ride = booking.getRide();
            User rider = booking.getRider();
            
            // Check for self-booking attempts
            boolean isSelfBooking = false;
            String reason = "";
            
            // Check 1: Same user ID
            if (ride.getDriver() != null && ride.getDriver().getUserId().equals(rider.getUserId())) {
                isSelfBooking = true;
                reason = "Same user ID for rider and driver";
            }
            
            // Check 2: Same phone number
            if (!isSelfBooking && ride.getDriver() != null && 
                ride.getDriver().getPhoneNumber().equals(rider.getPhoneNumber())) {
                isSelfBooking = true;
                reason = "Same phone number for rider and driver";
            }
            
            // Check 3: Same name and similar details
            if (!isSelfBooking && ride.getDriver() != null && 
                ride.getDriver().getName().equals(rider.getName())) {
                isSelfBooking = true;
                reason = "Same name for rider and driver";
            }
            
            if (isSelfBooking) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "SELF_BOOKING");
                activity.put("severity", "HIGH");
                activity.put("userId", rider.getUserId());
                activity.put("userName", rider.getName());
                activity.put("userPhone", rider.getPhoneNumber());
                activity.put("rideId", ride.getRideId());
                activity.put("bookingId", booking.getBookingId());
                activity.put("description", "User attempted to book their own ride: " + reason);
                activity.put("timestamp", booking.getCreatedAt() != null ? booking.getCreatedAt() : new java.util.Date());
                
                suspiciousActivities.add(activity);
            }
        }
        
        // Find rapid booking patterns (multiple bookings in short time by same user)
        Map<Long, List<Booking>> userBookings = allBookings.stream()
                .collect(Collectors.groupingBy(booking -> booking.getRider().getUserId()));
        
        for (Map.Entry<Long, List<Booking>> entry : userBookings.entrySet()) {
            List<Booking> bookings = entry.getValue();
            if (bookings.size() >= 3) { // 3 or more bookings might indicate suspicious activity
                User user = bookings.get(0).getRider();
                
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "RAPID_BOOKING");
                activity.put("severity", "MEDIUM");
                activity.put("userId", user.getUserId());
                activity.put("userName", user.getName());
                activity.put("userPhone", user.getPhoneNumber());
                activity.put("rideId", bookings.get(0).getRide().getRideId());
                activity.put("bookingId", bookings.get(0).getBookingId());
                activity.put("description", "User has " + bookings.size() + " bookings, which may indicate suspicious activity");
                activity.put("timestamp", bookings.get(0).getCreatedAt() != null ? bookings.get(0).getCreatedAt() : new java.util.Date());
                
                suspiciousActivities.add(activity);
            }
        }
        
        return suspiciousActivities;
    }

    // 🚫 Cancel suspicious booking
    @PutMapping("/bookings/{bookingId}/cancel")
    public Map<String, String> cancelSuspiciousBooking(
            @PathVariable Long bookingId, 
            @RequestHeader("Admin-Token") String token) {
        
        if (!isValidAdmin(token)) {
            throw new RuntimeException("❌ Access denied. Admin privileges required.");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Cancel the booking by setting status to REJECTED
        booking.setStatus(Booking.BookingStatus.REJECTED);
        bookingRepository.save(booking);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Suspicious booking #" + bookingId + " has been cancelled successfully");
        response.put("status", "success");
        
        return response;
    }
}
