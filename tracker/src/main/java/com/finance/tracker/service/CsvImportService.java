package com.finance.tracker.service;

import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.CategoryRule;
import com.finance.tracker.entity.Transaction;
import com.finance.tracker.entity.User;
import com.finance.tracker.repo.CategoryRepo;
import com.finance.tracker.repo.CategoryRuleRepo; // NEW
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

    @Autowired
    private CategoryRuleRepo categoryRuleRepo; // Inject the new repo!

    public void saveTransactionsFromCsv(MultipartFile file, User user) throws Exception {

        // 1. Fetch all the rules the app has learned for THIS user
        List<CategoryRule> userRules = categoryRuleRepo.findByUser(user);

        // Fetch a fallback category just in case
        Category generalCategory = categoryRepo.findByName("General")
                .orElseGet(() -> categoryRepo.save(new Category("General", "EXPENSE")));

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                if (row.length < 3 || row[2] == null || row[2].trim().isEmpty()) continue;

                try {
                    Transaction transaction = new Transaction();
                    transaction.setDate(LocalDate.parse(row[0].trim()));
                    transaction.setDescription(row[1].trim());
                    transaction.setAmount(new BigDecimal(row[2].trim()));
                    transaction.setUser(user);

                    // 2. SMART CATEGORIZATION: Check the learned rules!
                    assignCategoryDynamically(transaction, row[1].trim(), userRules, generalCategory);

                    transactionRepo.save(transaction);
                } catch (Exception e) {
                    System.err.println("Skipping invalid row " + i + ": " + e.getMessage());
                }
            }
        }
    }

    // THE CLEANED UP, OPTIMIZED METHOD
    private void assignCategoryDynamically(Transaction t, String desc, List<CategoryRule> rules, Category fallback) {
        String lowerDesc = desc.toLowerCase(Locale.ROOT);

        // Check if the description matches any of the user's learned rules
        for (CategoryRule rule : rules) {
            if (lowerDesc.contains(rule.getKeyword().toLowerCase())) {
                t.setCategory(rule.getCategory());
                t.setType(rule.getCategory().getType());
                return; // Match found! Stop looking.
            }
        }

        // If no rule matches, default to "General"
        t.setCategory(fallback);
        t.setType(fallback.getType());
    }
}