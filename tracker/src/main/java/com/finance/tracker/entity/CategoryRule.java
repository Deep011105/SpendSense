package com.finance.tracker.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "category_rules")
public class CategoryRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The keyword the app learned (e.g., "starbucks" or "netflix")
    @Column(nullable = false)
    private String keyword;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public CategoryRule() {}

    public CategoryRule(String keyword, Category category, User user) {
        this.keyword = keyword;
        this.category = category;
        this.user = user;
    }
}