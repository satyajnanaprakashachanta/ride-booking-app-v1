package com.rideapp.ridebooking.controllers;

import com.rideapp.ridebooking.dto.RideDTO;
import com.rideapp.ridebooking.models.Ride;
import com.rideapp.ridebooking.models.User;
import com.rideapp.ridebooking.repositories.RideRepository;
import com.rideapp.ridebooking.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/rides")
public class RideController {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Create ride (driver posts a ride)
    @PostMapping("/{driverId}")
    public RideDTO createRide(@PathVariable Long driverId, @RequestBody Ride ride) {
        Optional<User> driver = userRepository.findById(driverId);
        if (driver.isPresent()) {
            ride.setDriver(driver.get());
            ride.setStatus(Ride.RideStatus.PENDING);
            Ride savedRide = rideRepository.save(ride);
            return mapToDTO(savedRide);
        } else {
            throw new RuntimeException("Driver not found with id: " + driverId);
        }
    }

    // ✅ Get all rides
    @GetMapping
    public List<RideDTO> getAllRides() {
        return rideRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ Get ride by id
    @GetMapping("/{rideId}")
    public RideDTO getRideById(@PathVariable Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found with id: " + rideId));
        return mapToDTO(ride);
    }

    // ✅ Create ride request (without driver - for passenger requests)
    @PostMapping
    public RideDTO createRideRequest(@RequestBody Ride ride) {
        // Set status to PENDING so drivers can see and accept it
        ride.setStatus(Ride.RideStatus.PENDING);
        ride.setDriver(null); // No driver assigned initially
        Ride savedRide = rideRepository.save(ride);
        return mapToRideRequestDTO(savedRide);
    }

    // 🔹 Utility to convert Ride -> RideDTO
    private RideDTO mapToDTO(Ride ride) {
        return new RideDTO(
                ride.getRideId(),
                ride.getPickupLocation(),
                ride.getDropLocation(),
                ride.getPrice(),
                ride.getStatus().toString(),
                ride.getDriver() != null ? ride.getDriver().getName() : "No driver assigned",
                ride.getDistanceInMiles(),
                ride.getEstimatedDurationMinutes()
        );
    }

    // 🔹 Utility to convert Ride -> RideDTO for ride requests (no driver)
    private RideDTO mapToRideRequestDTO(Ride ride) {
        return new RideDTO(
                ride.getRideId(),
                ride.getPickupLocation(),
                ride.getDropLocation(),
                ride.getPrice(),
                ride.getStatus().toString(),
                "Looking for driver...",
                ride.getDistanceInMiles(),
                ride.getEstimatedDurationMinutes()
        );
    }
}
