package com.finance.tracker.controller;

import com.finance.tracker.entity.User;
import com.finance.tracker.repo.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepo userRepository;

    public UserController(UserRepo userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/upgrade")
    public ResponseEntity<?> upgradeUserRole() {
        // 1. Find out who is making the request
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Fetch them from the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Upgrade their role!
        user.setRole("PREMIUM");
        userRepository.save(user);

        return ResponseEntity.ok("Successfully upgraded to PREMIUM!");
    }
}