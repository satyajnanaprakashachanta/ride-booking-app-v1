package com.rideapp.ridebooking.dto;

public class BookingDTO {
    private Long bookingId;
    private Long rideId;
    private Long riderId;
    private String pickupLocation;
    private String dropLocation;
    private String rideTime;
    private Double distanceInMiles;
    private Double fare;
    private String status;
    private RideDTO ride;
    private String riderName;
    private String riderPhone;
    private String driverName;
    private String driverPhone;
    
    // Enhanced location data for Google Maps integration
    private String pickupLocationDetails; // JSON string with coordinates and place details
    private String dropLocationDetails; // JSON string with coordinates and place details

    // Default constructor for request/response operations
    public BookingDTO() {}

    // Constructor for full response
    public BookingDTO(Long bookingId, String status, RideDTO ride, 
                      String riderName, String riderPhone,
                      String driverName, String driverPhone) {
        this.bookingId = bookingId;
        this.status = status;
        this.ride = ride;
        this.riderName = riderName;
        this.riderPhone = riderPhone;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
    }

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    
    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }
    
    public Long getRiderId() { return riderId; }
    public void setRiderId(Long riderId) { this.riderId = riderId; }
    
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
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public RideDTO getRide() { return ride; }
    public void setRide(RideDTO ride) { this.ride = ride; }
    
    public String getRiderName() { return riderName; }
    public void setRiderName(String riderName) { this.riderName = riderName; }
    
    public String getRiderPhone() { return riderPhone; }
    public void setRiderPhone(String riderPhone) { this.riderPhone = riderPhone; }
    
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    
    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }
    
    // Enhanced location data getters and setters
    public String getPickupLocationDetails() { return pickupLocationDetails; }
    public void setPickupLocationDetails(String pickupLocationDetails) { this.pickupLocationDetails = pickupLocationDetails; }
    
    public String getDropLocationDetails() { return dropLocationDetails; }
    public void setDropLocationDetails(String dropLocationDetails) { this.dropLocationDetails = dropLocationDetails; }
}
