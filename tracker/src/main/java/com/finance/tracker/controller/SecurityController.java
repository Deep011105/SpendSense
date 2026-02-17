package com.finance.tracker.controller;

import com.finance.tracker.dto.JwtResponse;
import com.finance.tracker.dto.LoginRequest;
import com.finance.tracker.dto.SignupRequest;
import com.finance.tracker.model.User;
import com.finance.tracker.repo.UserRepo; // Use your actual repo package
import com.finance.tracker.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class SecurityController {

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

        // 1. Authenticate the user (Checks database for email & password match)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        // 2. Set the authentication in the context (Current Thread)
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generate the JWT Token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);

        // 4. Return the Token in the Response
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername()));
    }

    // --- 2. SIGNUP ENDPOINT ---
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        // --- ASSIGN ROLE ---
        // If the request doesn't specify a role, default to "USER"
        // (Note: We store it without "ROLE_" prefix usually, or with it. Consistency is key.)
        // Let's store it purely as "USER" or "ADMIN" to keep DB clean.
        String role = (signUpRequest.getRole() != null && !signUpRequest.getRole().isEmpty())
                ? signUpRequest.getRole().toUpperCase()
                : "USER";

        user.setRole(role);
        // -------------------

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}