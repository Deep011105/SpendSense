package com.finance.tracker.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class SecurityController {

    @PostMapping("/register")
    public void register() {
        System.out.println("hello");
    }

}
