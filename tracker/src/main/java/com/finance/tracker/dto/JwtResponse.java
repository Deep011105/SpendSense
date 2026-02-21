package com.finance.tracker.dto;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String tier; // The new tier variable

    // This is the 3-argument constructor we need!
    public JwtResponse(String accessToken, String email, String tier) {
        this.token = accessToken;
        this.email = email;
        this.tier = tier;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }
}