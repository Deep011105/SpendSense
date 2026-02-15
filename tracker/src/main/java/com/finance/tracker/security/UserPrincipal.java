package com.finance.tracker.security; // NOTE: Better to keep this in 'security', not 'model'

import com.finance.tracker.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private final User user;

    // 1. Fixed Constructor Syntax
    public UserPrincipal(User user) {
        this.user = user;
    }

    // 2. Return the correct Role/Authority
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Wraps the role string (e.g., "ROLE_USER") into a GrantedAuthority
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole()));
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