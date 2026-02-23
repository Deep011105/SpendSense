package com.finance.tracker.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // --- ADDED: The type field (INCOME or EXPENSE) ---
    @Column(nullable = false)
    private String type;

    // --- UPDATED: Constructor now takes both name and type ---
    public Category(String name, String type) {
        this.name = name;
        this.type = type;
    }

    // Required by JPA
    public Category() {}
}