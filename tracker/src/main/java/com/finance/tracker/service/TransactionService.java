package com.finance.tracker.service;

import com.finance.tracker.dto.CategoryStatsDTO;
import com.finance.tracker.dto.MonthlyStatsDTO;
import com.finance.tracker.dto.StatsDTO;
import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.model.Category;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import com.finance.tracker.repo.CategoryRepo;
import com.finance.tracker.repo.TransactionRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    private final TransactionRepo transactionRepository;
    private final CategoryRepo categoryRepository;

    // Constructor Injection (Best Practice)
    public TransactionService(TransactionRepo transactionRepository, CategoryRepo categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    // 1. Get all transactions for a specific user
    public List<Transaction> findAllByUser(User user) {
        return transactionRepository.findAllByUserOrderByDateDesc(user);
    }

    // 2. Create a new transaction
    public Transaction createTransaction(TransactionDTO dto, User user) {
        Transaction transaction = new Transaction();

        // Map basic fields
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType().toUpperCase()); // Ensure uppercase
        transaction.setDate(dto.getDate());
        transaction.setDescription(dto.getDescription());
        transaction.setUser(user);

        // Map Category: Look it up by name
        Category category = categoryRepository.findByName(dto.getCategory())
                .orElseThrow(() -> new RuntimeException("Category not found: " + dto.getCategory()));

        transaction.setCategory(category);

        return transactionRepository.save(transaction);
    }

    // 3. Delete a transaction (Security Check included)
    public void deleteTransaction(Long id, User user) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // SECURITY CHECK: Ensure the user owns this transaction before deleting
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }

    // Add this method to TransactionService.java

    // Update this method signature
    public StatsDTO getDashboardStats(User user, LocalDate start, LocalDate end) {

        // 1. Calculate Total Income in Range
        BigDecimal totalIncome = transactionRepository.sumByTypeAndDate(user, "INCOME", start, end);

        // 2. Calculate Total Expense in Range
        BigDecimal totalExpense = transactionRepository.sumByTypeAndDate(user, "EXPENSE", start, end);

        // Handle Nulls (if no transactions exist in range)
        totalIncome = (totalIncome == null) ? BigDecimal.ZERO : totalIncome;
        totalExpense = (totalExpense == null) ? BigDecimal.ZERO : totalExpense;

        // 3. Calculate Balance
        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new StatsDTO(totalIncome, totalExpense, balance);
    }

    // In TransactionService.java
    public List<Transaction> findTransactionsByDateRange(User user, LocalDate start, LocalDate end) {
        return transactionRepository.findByUserAndDateBetween(user, start, end);
    }

    public List<CategoryStatsDTO> getExpenseStats(User user) {
        return transactionRepository.findExpenseStatsByUser(user);
    }

    public Page<Transaction> getAllTransactions(int page, int size) {
        // PageRequest.of(pageNumber, itemsPerPage, SortOrder)
        // This creates a "page" request sorted by Date (Newest first)
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return transactionRepository.findAll(pageable);
    }

    // ... inside TransactionService class

    public List<com.finance.tracker.dto.MonthlyStatsDTO> getMonthlyStats(User user) {
        // 1. Get Start and End of Current Year
        int currentYear = LocalDate.now().getYear();
        LocalDate start = LocalDate.of(currentYear, 1, 1);
        LocalDate end = LocalDate.of(currentYear, 12, 31);

        // 2. Fetch ALL transactions for this year
        // (Re-using the method we created earlier)
        List<Transaction> transactions = findTransactionsByDateRange(user, start, end);

        // 3. Initialize the 12-month skeleton (so empty months show as 0 instead of missing)
        Map<Integer, MonthlyStatsDTO> statsMap = new LinkedHashMap<>();
        String[] months = {"JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"};

        for (int i = 0; i < 12; i++) {
            statsMap.put(i + 1, new MonthlyStatsDTO(months[i], BigDecimal.ZERO, BigDecimal.ZERO));
        }

        // 4. Group Data
        for (Transaction t : transactions) {
            int monthIndex = t.getDate().getMonthValue(); // 1 = Jan, 2 = Feb...
            MonthlyStatsDTO dto = statsMap.get(monthIndex);

            if ("INCOME".equalsIgnoreCase(t.getType())) {
                dto.setIncome(dto.getIncome().add(t.getAmount()));
            } else {
                dto.setExpense(dto.getExpense().add(t.getAmount()));
            }
        }

        // 5. Convert Map to List
        return new ArrayList<>(statsMap.values());
    }
}