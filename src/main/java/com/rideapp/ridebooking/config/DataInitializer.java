package com.rideapp.ridebooking.config;

import com.rideapp.ridebooking.models.AuthUser;
import com.rideapp.ridebooking.models.User;
import com.rideapp.ridebooking.repositories.AuthUserRepository;
import com.rideapp.ridebooking.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        // Check if admin user already exists
        if (!authUserRepository.existsByMobileNumber("admin")) {
            // Create admin AuthUser
            AuthUser adminAuthUser = new AuthUser("Admin", "User", "admin", "9010");
            authUserRepository.save(adminAuthUser);
            
            // Create corresponding admin User
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@ridebooking.com");
            adminUser.setPhoneNumber("admin");
            adminUser.setRole(User.Role.ADMIN);
            adminUser.setStatus(User.Status.ACTIVE);
            userRepository.save(adminUser);
            
            System.out.println("🔐 Admin user created successfully!");
            System.out.println("   Username: admin");
            System.out.println("   Password: 9010");
            System.out.println("   Role: ADMIN");
        } else {
            System.out.println("🔐 Admin user already exists.");
        }
    }
}
