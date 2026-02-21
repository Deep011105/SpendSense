package com.finance.tracker.service;

import com.finance.tracker.model.Category;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import com.finance.tracker.repo.CategoryRepo;
import com.finance.tracker.repo.TransactionRepo;
import com.opencsv.CSVReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
public class CsvImportService {

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    // Notice: We don't even need UserRepo injected here anymore!

    // --- 1. THE FIX: Accept the User object from the Controller ---
    public void saveTransactionsFromCsv(MultipartFile file, User user) throws Exception {

        // (Removed the hardcoded userRepo.findById(1L) logic)

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();

            // Iterate rows (Skip header at index 0)
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);

                // SAFETY CHECK: Skip empty or malformed rows
                if (row.length < 3) {
                    continue;
                }

                // Ensure the Amount column is not empty before parsing
                if (row[2] == null || row[2].trim().isEmpty()) {
                    continue;
                }

                String dateStr = row[0].trim();
                String description = row[1].trim();
                String amountStr = row[2].trim();

                try {
                    Transaction transaction = new Transaction();
                    transaction.setDate(LocalDate.parse(dateStr)); // Format must be YYYY-MM-DD
                    transaction.setDescription(description);
                    transaction.setAmount(new BigDecimal(amountStr));

                    // --- 2. THE FIX: Attach the securely authenticated user! ---
                    transaction.setUser(user);

                    // Smart Categorization
                    assignCategoryAndType(transaction, description);

                    transactionRepo.save(transaction);
                } catch (Exception e) {
                    System.err.println("Skipping invalid row " + i + ": " + e.getMessage());
                }
            }
        }
    }

    private void assignCategoryAndType(Transaction t, String desc) {
        String lowerDesc = desc.toLowerCase(Locale.ROOT);
        String categoryName = "General";
        String type = "EXPENSE";

        // Determine Category Name & Type
        if (lowerDesc.contains("salary") || lowerDesc.contains("credit")) {
            type = "INCOME";
            categoryName = "Salary";
        }
        else if (lowerDesc.contains("zomato") || lowerDesc.contains("swiggy") || lowerDesc.contains("starbucks")) {
            categoryName = "Food";
        }
        else if (lowerDesc.contains("uber") || lowerDesc.contains("ola") || lowerDesc.contains("fuel")) {
            categoryName = "Transport";
        }

        t.setType(type);

        final String finalCategoryName = categoryName;

        Category category = categoryRepo.findByName(finalCategoryName)
                .orElseGet(() -> {
                    Category newCat = new Category();
                    newCat.setName(finalCategoryName);
                    return categoryRepo.save(newCat);
                });

        t.setCategory(category);
    }
}