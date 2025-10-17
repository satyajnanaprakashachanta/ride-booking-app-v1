package com.rideapp.ridebooking.controllers;

import com.rideapp.ridebooking.dto.AuthResponse;
import com.rideapp.ridebooking.dto.LoginRequest;
import com.rideapp.ridebooking.dto.RegisterRequest;
import com.rideapp.ridebooking.models.AuthUser;
import com.rideapp.ridebooking.models.User;
import com.rideapp.ridebooking.repositories.AuthUserRepository;
import com.rideapp.ridebooking.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            // Validate input
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "First name is required"));
            }
            
            if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Last name is required"));
            }
            
            if (request.getMobileNumber() == null || request.getMobileNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Mobile number is required"));
            }
            
            if (request.getPassword() == null || request.getPassword().length() < 4 || request.getPassword().length() > 10) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Password must be between 4-10 characters"));
            }
            
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Passwords do not match"));
            }

            // Check if mobile number already exists
            if (authUserRepository.existsByMobileNumber(request.getMobileNumber())) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Mobile number already registered"));
            }

            // Create new auth user
            AuthUser newUser = new AuthUser(
                request.getFirstName().trim(),
                request.getLastName().trim(),
                request.getMobileNumber().trim(),
                request.getPassword()
            );

            AuthUser savedAuthUser = authUserRepository.save(newUser);

            // Also create corresponding user in the User table
            User mainUser = new User();
            mainUser.setName(savedAuthUser.getFullName());
            mainUser.setPhoneNumber(savedAuthUser.getMobileNumber());
            mainUser.setEmail(savedAuthUser.getFullName().toLowerCase().replace(" ", "") + "@ridebooking.com");
            
            // Set role based on frontend selection
            if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
                mainUser.setRole(User.Role.ADMIN);
            } else if (request.getRole() != null && request.getRole().equalsIgnoreCase("RIDER")) {
                mainUser.setRole(User.Role.RIDER);
            } else if (request.getRole() != null && request.getRole().equalsIgnoreCase("DRIVER")) {
                mainUser.setRole(User.Role.DRIVER);
            } else {
                // Default to RIDER if no role specified
                mainUser.setRole(User.Role.RIDER);
            }
            
            mainUser.setStatus(User.Status.ACTIVE);
            User savedMainUser = userRepository.save(mainUser);

            return ResponseEntity.ok(new AuthResponse(
                true, 
                "Registration successful",
                savedMainUser.getUserId(),  // Return the User table's userId
                savedAuthUser.getFullName(),
                savedAuthUser.getMobileNumber()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new AuthResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            // Validate input
            if (request.getMobileNumber() == null || request.getMobileNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Mobile number is required"));
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Password is required"));
            }

            // Find user by mobile and password
            Optional<AuthUser> userOpt = authUserRepository.findByMobileNumberAndPassword(
                request.getMobileNumber().trim(), 
                request.getPassword()
            );

            if (userOpt.isPresent()) {
                AuthUser authUser = userOpt.get();
                if (authUser.isActive()) {
                    // Find the corresponding user in the User table by phone number
                    Optional<User> mainUserOpt = userRepository.findByPhoneNumber(authUser.getMobileNumber());
                    if (mainUserOpt.isPresent()) {
                        User mainUser = mainUserOpt.get();
                        return ResponseEntity.ok(new AuthResponse(
                            true,
                            "Login successful",
                            mainUser.getUserId(),  // Use the userId from the User table
                            authUser.getFullName(),
                            authUser.getMobileNumber(),
                            mainUser.getRole().toString()  // Include role information
                        ));
                    } else {
                        return ResponseEntity.badRequest().body(new AuthResponse(false, "User profile not found"));
                    }
                } else {
                    return ResponseEntity.badRequest().body(new AuthResponse(false, "Account is deactivated"));
                }
            } else {
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Invalid mobile number or password"));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new AuthResponse(false, "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<AuthResponse> getUserInfo(@PathVariable Long userId) {
        try {
            Optional<AuthUser> userOpt = authUserRepository.findById(userId);
            if (userOpt.isPresent()) {
                AuthUser user = userOpt.get();
                return ResponseEntity.ok(new AuthResponse(
                    true,
                    "User found",
                    user.getUserId(),
                    user.getFullName(),
                    user.getMobileNumber()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new AuthResponse(false, "Error fetching user: " + e.getMessage()));
        }
    }
}
