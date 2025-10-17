package com.rideapp.ridebooking.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rideId;

    // Link to driver (User)
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    private String pickupLocation;
    private String dropLocation;
    private LocalDateTime time;
    private Double price;
    private Double distanceInMiles;
    private Integer estimatedDurationMinutes;

    @Enumerated(EnumType.STRING)
    private RideStatus status = RideStatus.PENDING;
    
    public enum RideStatus {
        PENDING, CONFIRMED, COMPLETED, CANCELLED
    }

    // Default constructor
    public Ride() {}

    // Constructor with parameters
    public Ride(User driver, String pickupLocation, String dropLocation, LocalDateTime time, Double price) {
        this.driver = driver;
        this.pickupLocation = pickupLocation;
        this.dropLocation = dropLocation;
        this.time = time;
        this.price = price;
    }

    // Getters and Setters
    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }

    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDropLocation() { return dropLocation; }
    public void setDropLocation(String dropLocation) { this.dropLocation = dropLocation; }

    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getDistanceInMiles() { return distanceInMiles; }
    public void setDistanceInMiles(Double distanceInMiles) { this.distanceInMiles = distanceInMiles; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public RideStatus getStatus() { return status; }
    public void setStatus(RideStatus status) { this.status = status; }
}
