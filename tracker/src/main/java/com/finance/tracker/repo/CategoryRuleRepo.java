package com.finance.tracker.repo;

import com.finance.tracker.entity.CategoryRule;
import com.finance.tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRuleRepo extends JpaRepository<CategoryRule, Long> {
    // Fetches all the secret rules your app has learned for this specific user
    List<CategoryRule> findByUser(User user);
}