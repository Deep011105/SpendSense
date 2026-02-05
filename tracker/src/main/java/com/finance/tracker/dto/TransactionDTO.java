package com.finance.tracker.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionDTO {
    private BigDecimal amount;
    private String type;        // "INCOME" or "EXPENSE"
    private String category;    // Name of the category (e.g., "Food")
    private String description;
    private LocalDate date;
}