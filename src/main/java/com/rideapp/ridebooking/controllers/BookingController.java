package com.rideapp.ridebooking.controllers;

import com.rideapp.ridebooking.dto.BookingDTO;
import com.rideapp.ridebooking.dto.RideDTO;
import com.rideapp.ridebooking.exceptions.BookingNotFoundException;
import com.rideapp.ridebooking.models.Booking;
import com.rideapp.ridebooking.models.Ride;
import com.rideapp.ridebooking.models.User;
import com.rideapp.ridebooking.repositories.BookingRepository;
import com.rideapp.ridebooking.repositories.RideRepository;
import com.rideapp.ridebooking.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    // Rider posts a booking request
    @PostMapping("/{rideId}/{riderId}")
    public BookingDTO createBooking(@PathVariable Long rideId,
                                    @PathVariable Long riderId,
                                    @RequestBody BookingDTO bookingRequest) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        User rider = userRepository.findById(riderId)
                .orElseThrow(() -> new RuntimeException("Rider not found"));

        // VALIDATION: Prevent users from booking their own rides
        if (ride.getDriver() != null && ride.getDriver().getUserId().equals(riderId)) {
            throw new RuntimeException("🚫 SELF-BOOKING BLOCKED: You cannot book your own ride!");
        }

        // ADDITIONAL VALIDATION: Check phone number match (safety check for same user)
        if (ride.getDriver() != null && ride.getDriver().getPhoneNumber().equals(rider.getPhoneNumber())) {
            throw new RuntimeException("🚫 SELF-BOOKING BLOCKED: Same user detected attempting to book own ride!");
        }

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setRider(rider);
        booking.setStatus(Booking.BookingStatus.REQUESTED);

        // Extra details from request
        booking.setPickupLocation(bookingRequest.getPickupLocation());
        booking.setDropLocation(bookingRequest.getDropLocation());
        booking.setRideTime(bookingRequest.getRideTime());
        
        // Set booking-specific distance and fare (if provided, otherwise use ride defaults)
        booking.setDistanceInMiles(bookingRequest.getDistanceInMiles() != null ? 
            bookingRequest.getDistanceInMiles() : ride.getDistanceInMiles());
        booking.setFare(bookingRequest.getFare() != null ? 
            bookingRequest.getFare() : ride.getPrice());

        // Set enhanced location data for Google Maps integration
        booking.setPickupLocationDetails(bookingRequest.getPickupLocationDetails());
        booking.setDropLocationDetails(bookingRequest.getDropLocationDetails());

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDTO(savedBooking);
    }

    // Get all bookings
    @GetMapping
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get only pending bookings (for drivers to see available ride requests)
    @GetMapping("/pending")
    public List<BookingDTO> getPendingBookings() {
        return bookingRepository.findAll()
                .stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.REQUESTED)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get booking by id
    @GetMapping("/{id}")
    public BookingDTO getBookingById(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));
        return mapToDTO(booking);
    }

    // Driver accepts booking
    @PutMapping("/{bookingId}/accept")
    public BookingDTO acceptBooking(@PathVariable Long bookingId, @RequestParam Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        // Find the user who is accepting the booking
        User acceptingDriver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // DUAL-ROLE SYSTEM: Allow any user to act as driver (except ADMIN)
        if (acceptingDriver.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Admin users cannot accept bookings as drivers!");
        }

        // ENHANCED VALIDATION: Prevent users from accepting their own ride requests
        if (booking.getRider().getUserId().equals(driverId)) {
            throw new RuntimeException("🚫 SELF-BOOKING BLOCKED: You cannot accept your own ride request! Please use a different account to accept this booking.");
        }

        // VALIDATION: Check if rider and driver are the same person (phone number check)
        if (booking.getRider().getPhoneNumber().equals(acceptingDriver.getPhoneNumber())) {
            throw new RuntimeException("🚫 SELF-BOOKING BLOCKED: Same user detected attempting self-booking! Please use a different account to accept this booking.");
        }

        // VALIDATION: Check if booking is already accepted
        if (booking.getStatus() == Booking.BookingStatus.ACCEPTED) {
            throw new RuntimeException("❌ BOOKING ALREADY ACCEPTED: This booking has already been accepted by another driver!");
        }

        // Update the ride to be assigned to the accepting driver
        Ride ride = booking.getRide();
        ride.setDriver(acceptingDriver);
        
        // Update ride status to CONFIRMED when a booking is accepted
        ride.setStatus(Ride.RideStatus.CONFIRMED);
        rideRepository.save(ride);

        booking.setStatus(Booking.BookingStatus.ACCEPTED);
        return mapToDTO(bookingRepository.save(booking));
    }

    // Driver rejects booking
    @PutMapping("/{bookingId}/reject")
    public BookingDTO rejectBooking(@PathVariable Long bookingId, @RequestParam Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify the user exists and can act as driver
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // DUAL-ROLE SYSTEM: Allow any user to act as driver (except ADMIN)
        if (driver.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Admin users cannot reject bookings as drivers!");
        }

        booking.setStatus(Booking.BookingStatus.REJECTED);
        return mapToDTO(bookingRepository.save(booking));
    }

    // Get all bookings accepted by a specific driver
    @GetMapping("/drivers/{driverId}/accepted")
    public List<BookingDTO> getAcceptedBookingsByDriver(@PathVariable Long driverId) {
        // Find the driver
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (!driver.getRole().equals(User.Role.DRIVER)) {
            throw new RuntimeException("User is not a driver!");
        }

        // Get all accepted bookings where this user is the driver
        List<Booking> acceptedBookings = bookingRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.ACCEPTED)
                .filter(booking -> booking.getRide().getDriver() != null)
                .filter(booking -> booking.getRide().getDriver().getUserId().equals(driverId))
                .collect(Collectors.toList());

        return acceptedBookings.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Convert Booking -> BookingDTO
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
        
        // Set enhanced location data
        dto.setPickupLocationDetails(booking.getPickupLocationDetails());
        dto.setDropLocationDetails(booking.getDropLocationDetails());
        
        // Create RideDTO for nested ride information
        RideDTO rideDTO = new RideDTO(
            booking.getRide().getRideId(),
            booking.getRide().getPickupLocation(),
            booking.getRide().getDropLocation(),
            booking.getRide().getPrice(),
            booking.getRide().getStatus().name(),
            booking.getRide().getDriver() != null ? booking.getRide().getDriver().getName() : "Looking for driver...",
            booking.getRide().getDistanceInMiles(),
            booking.getRide().getEstimatedDurationMinutes()
        );
        dto.setRide(rideDTO);
        
        return dto;
    }

    // Update booking details (only allowed for REQUESTED status)
    @PutMapping("/{bookingId}")
    public BookingDTO updateBooking(@PathVariable Long bookingId, @RequestBody BookingDTO bookingRequest) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
        
        // Only allow updates if booking is still in REQUESTED status
        if (booking.getStatus() != Booking.BookingStatus.REQUESTED) {
            throw new RuntimeException("Cannot update booking. Booking has already been " + booking.getStatus().name().toLowerCase());
        }
        
        // Update the booking details
        if (bookingRequest.getPickupLocation() != null) {
            booking.setPickupLocation(bookingRequest.getPickupLocation());
        }
        if (bookingRequest.getDropLocation() != null) {
            booking.setDropLocation(bookingRequest.getDropLocation());
        }
        if (bookingRequest.getRideTime() != null) {
            booking.setRideTime(bookingRequest.getRideTime());
        }
        if (bookingRequest.getFare() != null) {
            booking.setFare(bookingRequest.getFare());
        }
        
        // Recalculate distance if locations changed
        if (bookingRequest.getPickupLocation() != null || bookingRequest.getDropLocation() != null) {
            // Simple distance calculation (you can replace with more sophisticated logic)
            double estimatedDistance = Math.random() * 10 + 1; // Random between 1-11 miles for demo
            booking.setDistanceInMiles(estimatedDistance);
        }
        
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToDTO(updatedBooking);
    }

    // Cancel/Delete booking (only allowed for REQUESTED status)
    @DeleteMapping("/{bookingId}")
    public String cancelBooking(@PathVariable Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
        
        // Only allow cancellation if booking is still in REQUESTED status
        if (booking.getStatus() != Booking.BookingStatus.REQUESTED) {
            throw new RuntimeException("Cannot cancel booking. Booking has already been " + booking.getStatus().name().toLowerCase());
        }
        
        bookingRepository.delete(booking);
        return "Booking cancelled successfully";
    }
}
