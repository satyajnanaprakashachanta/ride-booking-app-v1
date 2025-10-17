package com.rideapp.ridebooking.repositories;

import com.rideapp.ridebooking.models.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {
    Optional<AuthUser> findByMobileNumber(String mobileNumber);
    boolean existsByMobileNumber(String mobileNumber);
    Optional<AuthUser> findByMobileNumberAndPassword(String mobileNumber, String password);
}
