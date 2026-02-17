package com.finance.tracker.dto;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;

    public JwtResponse(String accessToken, String email) {
        this.token = accessToken;
        this.email = email;
    }

    // Getters
    public String getAccessToken() { return token; }
    public String getTokenType() { return type; }
    public String getEmail() { return email; }
}