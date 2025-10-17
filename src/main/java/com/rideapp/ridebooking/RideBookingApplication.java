package com.rideapp.ridebooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RideBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(RideBookingApplication.class, args);
    }
}
