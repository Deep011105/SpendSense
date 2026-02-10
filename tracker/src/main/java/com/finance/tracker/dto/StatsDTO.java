package com.finance.tracker.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StatsDTO {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;

    // Constructor to initialize with zeros to avoid NullPointerExceptions
    public StatsDTO() {
        this.totalIncome = BigDecimal.ZERO;
        this.totalExpense = BigDecimal.ZERO;
        this.balance = BigDecimal.ZERO;
    }

    public StatsDTO(BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal balance) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
    }
}