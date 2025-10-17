package com.rideapp.ridebooking.controllers;

import com.rideapp.ridebooking.models.AuthUser;
import com.rideapp.ridebooking.models.Booking;
import com.rideapp.ridebooking.models.Ride;
import com.rideapp.ridebooking.models.User;
import com.rideapp.ridebooking.repositories.AuthUserRepository;
import com.rideapp.ridebooking.repositories.BookingRepository;
import com.rideapp.ridebooking.repositories.RideRepository;
import com.rideapp.ridebooking.repositories.UserRepository;
import com.rideapp.ridebooking.services.BookingCleanupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private BookingCleanupService bookingCleanupService;
    
    @Autowired
    private AuthUserRepository authUserRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RideRepository rideRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    // Manual cleanup endpoint - Admin only
    @PostMapping("/cleanup-bookings")
    public ResponseEntity<String> manualCleanup(@RequestHeader(value = "Admin-Token", required = false) String adminToken) {
        // Check if admin token is valid (simple check for mobile number "admin")
        if (adminToken == null || !adminToken.equals("admin")) {
            return ResponseEntity.status(403).body("❌ Access denied. Admin privileges required.");
        }
        
        // Verify admin user exists with correct credentials
        AuthUser admin = authUserRepository.findByMobileNumber("admin").orElse(null);
        if (admin == null || !admin.getPassword().equals("9010")) {
            return ResponseEntity.status(403).body("❌ Invalid admin credentials.");
        }
        
        bookingCleanupService.performCleanup();
        return ResponseEntity.ok("✅ Manual booking cleanup completed!");
    }
}
