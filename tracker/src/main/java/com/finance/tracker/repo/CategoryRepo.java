package com.finance.tracker.repo;

import com.finance.tracker.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    // Spring generates the SQL for this automatically based on the method name!
    Optional<Category> findByName(String name);
}
