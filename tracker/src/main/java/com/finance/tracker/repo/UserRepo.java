package com.finance.tracker.repo;

import com.finance.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    // SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Check if email exists before registering
    Boolean existsByEmail(String email);
}
