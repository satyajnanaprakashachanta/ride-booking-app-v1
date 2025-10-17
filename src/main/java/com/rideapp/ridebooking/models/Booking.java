package com.rideapp.ridebooking.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    private Ride ride;

    @ManyToOne
    @JoinColumn(name = "rider_id")
    private User rider;

    private String pickupLocation;
    private String dropLocation;
    private String rideTime;
    private Double distanceInMiles;
    private Double fare;
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enhanced location data for Google Maps integration
    @Column(columnDefinition = "TEXT")
    private String pickupLocationDetails; // JSON string with coordinates and place details
    
    @Column(columnDefinition = "TEXT")
    private String dropLocationDetails; // JSON string with coordinates and place details

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.REQUESTED;

    public enum BookingStatus {
        REQUESTED, ACCEPTED, REJECTED
    }

    // Getters and setters...
    public Long getBookingId() { return bookingId; }
    public Ride getRide() { return ride; }
    public void setRide(Ride ride) { this.ride = ride; }
    public User getRider() { return rider; }
    public void setRider(User rider) { this.rider = rider; }
    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
    public String getDropLocation() { return dropLocation; }
    public void setDropLocation(String dropLocation) { this.dropLocation = dropLocation; }
    public String getRideTime() { return rideTime; }
    public void setRideTime(String rideTime) { this.rideTime = rideTime; }
    public Double getDistanceInMiles() { return distanceInMiles; }
    public void setDistanceInMiles(Double distanceInMiles) { this.distanceInMiles = distanceInMiles; }
    public Double getFare() { return fare; }
    public void setFare(Double fare) { this.fare = fare; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Enhanced location data getters and setters
    public String getPickupLocationDetails() { return pickupLocationDetails; }
    public void setPickupLocationDetails(String pickupLocationDetails) { this.pickupLocationDetails = pickupLocationDetails; }
    public String getDropLocationDetails() { return dropLocationDetails; }
    public void setDropLocationDetails(String dropLocationDetails) { this.dropLocationDetails = dropLocationDetails; }
}
