package com.finance.tracker;

import com.finance.tracker.entity.Category;
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
        if (categoryRepository.count() == 0) {

            List<Category> defaultCategories = Arrays.asList(
                    // --- INCOME ---
                    new Category("Salary", "INCOME"),
                    new Category("Freelance", "INCOME"),
                    new Category("Investments", "INCOME"),
                    new Category("Refunds", "INCOME"),
                    new Category("Rental Income", "INCOME"),
                    new Category("Dividends", "INCOME"),
                    new Category("Gifts Received", "INCOME"),
                    new Category("Side Hustle", "INCOME"),
                    new Category("Other Income", "INCOME"),

                    // --- HOUSING & UTILITIES ---
                    new Category("Rent", "EXPENSE"),
                    new Category("Mortgage", "EXPENSE"),
                    new Category("Utilities", "EXPENSE"),
                    new Category("Internet & Cable", "EXPENSE"),
                    new Category("Home Maintenance", "EXPENSE"),

                    // --- FOOD & DINING ---
                    new Category("Groceries", "EXPENSE"),
                    new Category("Dining Out", "EXPENSE"),
                    new Category("Coffee & Snacks", "EXPENSE"),
                    new Category("Alcohol & Bars", "EXPENSE"),

                    // --- TRANSPORTATION ---
                    new Category("Public Transport", "EXPENSE"),
                    new Category("Fuel", "EXPENSE"),
                    new Category("Car Maintenance", "EXPENSE"),
                    new Category("Ride Sharing", "EXPENSE"),
                    new Category("Car Payment", "EXPENSE"),
                    new Category("Travel & Flights", "EXPENSE"),

                    // --- HEALTH & WELLNESS ---
                    new Category("Healthcare", "EXPENSE"),
                    new Category("Pharmacy", "EXPENSE"),
                    new Category("Gym & Fitness", "EXPENSE"),
                    new Category("Personal Care", "EXPENSE"),
                    new Category("Pets", "EXPENSE"),

                    // --- LIFESTYLE & ENTERTAINMENT ---
                    new Category("Entertainment", "EXPENSE"),
                    new Category("Shopping", "EXPENSE"),
                    new Category("Subscriptions", "EXPENSE"),
                    new Category("Hobbies", "EXPENSE"),
                    new Category("Beauty", "EXPENSE"),

                    // --- FINANCIAL & OBLIGATIONS ---
                    new Category("Debt Repayment", "EXPENSE"),
                    new Category("Insurance", "EXPENSE"),
                    new Category("Taxes", "EXPENSE"),
                    new Category("Bank Fees", "EXPENSE"),
                    new Category("Charity & Donations", "EXPENSE"),

                    // --- MISCELLANEOUS ---
                    new Category("Education", "EXPENSE"),
                    new Category("Gifts Given", "EXPENSE"),
                    new Category("Childcare", "EXPENSE"),
                    new Category("General", "EXPENSE")
            );

            categoryRepository.saveAll(defaultCategories);

            System.out.println("✅ Comprehensive Default Categories seeded into database!");
        }
    }
}