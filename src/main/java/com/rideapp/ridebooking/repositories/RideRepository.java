package com.rideapp.ridebooking.repositories;

import com.rideapp.ridebooking.models.Ride;
import com.rideapp.ridebooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriver(User driver);
}

