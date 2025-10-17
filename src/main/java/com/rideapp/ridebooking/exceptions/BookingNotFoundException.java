package com.rideapp.ridebooking.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(String message) {
        super(message);
    }
    
    public BookingNotFoundException(Long bookingId) {
        super("Booking not found with id: " + bookingId);
    }
}
