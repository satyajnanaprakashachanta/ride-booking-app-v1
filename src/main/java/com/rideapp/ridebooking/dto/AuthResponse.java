package com.rideapp.ridebooking.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private Long userId;
    private String fullName;
    private String mobileNumber;
    private String role;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AuthResponse(boolean success, String message, Long userId, String fullName, String mobileNumber) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.fullName = fullName;
        this.mobileNumber = mobileNumber;
    }

    public AuthResponse(boolean success, String message, Long userId, String fullName, String mobileNumber, String role) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.fullName = fullName;
        this.mobileNumber = mobileNumber;
        this.role = role;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
