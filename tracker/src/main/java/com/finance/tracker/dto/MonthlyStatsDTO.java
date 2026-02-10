package com.finance.tracker.dto;

import java.math.BigDecimal;

public class MonthlyStatsDTO {
    private String month;       // e.g., "JAN"
    private BigDecimal income;
    private BigDecimal expense;

    public MonthlyStatsDTO(String month, BigDecimal income, BigDecimal expense) {
        this.month = month;
        this.income = income;
        this.expense = expense;
    }

    // Getters and Setters (Important for JSON conversion!)
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public BigDecimal getIncome() { return income; }
    public void setIncome(BigDecimal income) { this.income = income; }

    public BigDecimal getExpense() { return expense; }
    public void setExpense(BigDecimal expense) { this.expense = expense; }
}