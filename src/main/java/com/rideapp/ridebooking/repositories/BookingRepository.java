package com.rideapp.ridebooking.repositories;

import com.rideapp.ridebooking.models.Booking;
import com.rideapp.ridebooking.models.Ride;
import com.rideapp.ridebooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRide(Ride ride);
    List<Booking> findByRider(User rider);
}
