package com.finance.tracker.service;

import com.finance.tracker.dto.CategoryStatsDTO;
import com.finance.tracker.dto.StatsDTO;
import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.model.Category;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import com.finance.tracker.repo.CategoryRepo;
import com.finance.tracker.repo.TransactionRepo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

    public StatsDTO getDashboardStats(User user) {
        BigDecimal totalIncome = transactionRepository.getTotalIncome(user);
        BigDecimal totalExpense = transactionRepository.getTotalExpense(user);

        // Handle nulls (if user has 0 transactions)
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        StatsDTO stats = new StatsDTO();
        stats.setTotalIncome(totalIncome);
        stats.setTotalExpense(totalExpense);
        stats.setBalance(totalIncome.subtract(totalExpense));

        return stats;
    }

    // In TransactionService.java
    public List<Transaction> findTransactionsByDateRange(User user, LocalDate start, LocalDate end) {
        return transactionRepository.findByUserAndDateBetween(user, start, end);
    }

    public List<CategoryStatsDTO> getExpenseStats(User user) {
        return transactionRepository.findExpenseStatsByUser(user);
    }
}