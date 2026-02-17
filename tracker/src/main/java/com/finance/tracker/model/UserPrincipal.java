package com.finance.tracker.model; // NOTE: Better to keep this in 'security', not 'model'

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private final User user;

    // 1. Fixed Constructor Syntax
    public UserPrincipal(User user) {
        this.user = user;
    }

    // 2. Return the correct Role/Authority
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 1. Get the role from your Entity (e.g., "USER" or "ADMIN")
        String roleName = user.getRole();

        // 2. Ensure it starts with "ROLE_" (Spring Security expects this prefix!)
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        // 3. Return it as an authority
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    // 3. Return the Password hash from DB
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // 4. Return Email as the Username
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // 5. Boilerplate: Account Status (Must return true to allow login)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}