package com.finance.tracker.repo;

import com.finance.tracker.dto.CategoryStatsDTO;
import com.finance.tracker.entity.Transaction;
import com.finance.tracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepo extends JpaRepository<Transaction, Long> {

    List<Transaction> findAllByUserOrderByDateDesc(User user);

    // Sum all amounts where type = 'INCOME' for this user
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = 'INCOME'")
    BigDecimal getTotalIncome(@Param("user") User user);

    // Sum all amounts where type = 'EXPENSE' for this user
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE'")
    BigDecimal getTotalExpense(@Param("user") User user);

    // In TransactionRepo.java
    List<Transaction> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT new com.finance.tracker.dto.CategoryStatsDTO(c.name, SUM(t.amount)) " +
            "FROM Transaction t " +
            "JOIN t.category c " +
            // THE FIX: Use UPPER() to catch both "Expense" and "EXPENSE"
            "WHERE t.user = :user AND UPPER(t.type) = 'EXPENSE' " +
            "GROUP BY c.name")
    List<CategoryStatsDTO> findExpenseStatsByUser(@Param("user") User user);

    // 1. For the Table (Pagination + Filter)
    Page<Transaction> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate, Pageable pageable);

    // 2. NEW: For the Stats (Summing Income/Expense in a range)
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByTypeAndDate(
            @Param("user") User user,
            @Param("type") String type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<Transaction> findByUserEmail(String userEmail);
}