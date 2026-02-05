package com.finance.tracker;

import com.finance.tracker.model.Category;
import com.finance.tracker.repo.CategoryRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepo categoryRepository;

    public DataSeeder(CategoryRepo categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if categories already exist to prevent duplicates
        if (categoryRepository.count() == 0) {
            List<String> defaultCategories = Arrays.asList(
                    "Food",
                    "Rent",
                    "Utilities",
                    "Transport",
                    "Entertainment",
                    "Salary",
                    "Freelance",
                    "Shopping"
            );

            for (String categoryName : defaultCategories) {
                categoryRepository.save(new Category(categoryName));
            }

            System.out.println("✅ Default categories seeded into database!");
        }
    }
}