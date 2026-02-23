package com.finance.tracker.controller;

import com.finance.tracker.dto.JwtResponse;
import com.finance.tracker.dto.LoginRequest;
import com.finance.tracker.dto.SignupRequest;
import com.finance.tracker.entity.User;
import com.finance.tracker.repo.UserRepo;
import com.finance.tracker.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepo userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // --- 1. LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generate Token
        String jwt = jwtUtils.generateToken(userDetails);

        // Get the user's tier/role (e.g., "BASIC" or "PREMIUM")
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Grab the first role (assuming one role per user for this app)
        String userTier = roles.isEmpty() ? "BASIC" : roles.get(0).replace("ROLE_", "");

        // Return Token AND the User Tier to the frontend
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), userTier));
    }

    // --- 2. REGISTER ENDPOINT (Matched to React frontend) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Create new user (Mapping 'name' from React to 'fullName' in Spring)
        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        // --- ASSIGN TIER ---
        // Default every new signup to the BASIC tier to trigger our frontend paywalls
        String tier = (signUpRequest.getRole() != null && !signUpRequest.getRole().isEmpty())
                ? signUpRequest.getRole().toUpperCase()
                : "BASIC";

        user.setRole(tier);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}