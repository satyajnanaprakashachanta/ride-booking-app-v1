package com.rideapp.ridebooking.dto;

public class RideDTO {
    private Long rideId;
    private String pickupLocation;
    private String dropLocation;
    private double price;
    private String status;
    private String driverName;
    private Double distanceInMiles;
    private Integer estimatedDurationMinutes;

    public RideDTO(Long rideId, String pickupLocation, String dropLocation, double price, String status, String driverName, Double distanceInMiles, Integer estimatedDurationMinutes) {
        this.rideId = rideId;
        this.pickupLocation = pickupLocation;
        this.dropLocation = dropLocation;
        this.price = price;
        this.status = status;
        this.driverName = driverName;
        this.distanceInMiles = distanceInMiles;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
    }

    // Getters only (no setters needed for response)
    public Long getRideId() { return rideId; }
    public String getPickupLocation() { return pickupLocation; }
    public String getDropLocation() { return dropLocation; }
    public double getPrice() { return price; }
    public String getStatus() { return status; }
    public String getDriverName() { return driverName; }
    public Double getDistanceInMiles() { return distanceInMiles; }
    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
}
