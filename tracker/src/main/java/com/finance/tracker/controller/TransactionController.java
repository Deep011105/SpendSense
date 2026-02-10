package com.finance.tracker.controller;

import com.finance.tracker.dto.CategoryStatsDTO;
import com.finance.tracker.dto.StatsDTO;
import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import com.finance.tracker.repo.TransactionRepo; // Import this
import com.finance.tracker.repo.UserRepo;
import com.finance.tracker.service.CsvImportService;
import com.finance.tracker.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable; // CORRECT IMPORT
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepo userRepository;
    private final TransactionRepo transactionRepo; // Added Repo
    private final CsvImportService csvImportService; // Added Service

    // Constructor Injection for all dependencies
    public TransactionController(TransactionService transactionService,
                                 UserRepo userRepository,
                                 TransactionRepo transactionRepo,
                                 CsvImportService csvImportService) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
        this.transactionRepo = transactionRepo;
        this.csvImportService = csvImportService;
    }

    // --- 1. THE MASTER GET METHOD (Merged Pagination + Date Filtering) ---
    @GetMapping
    public Page<Transaction> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        // 1. Setup Pagination (Sort by Date Descending)
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());

        // 2. Handle Date Defaults (If frontend sends null, default to last 30 days)
        LocalDate end = (endDate != null && !endDate.isEmpty())
                ? LocalDate.parse(endDate)
                : LocalDate.now();

        LocalDate start = (startDate != null && !startDate.isEmpty())
                ? LocalDate.parse(startDate)
                : LocalDate.now().minusDays(30);

        // 3. Fetch from Repo
        // Note: For now this fetches ALL users' data in that range.
        // We will fix this to be 'findByUserAndDateBetween' in the Security phase.
        return transactionRepo.findByDateBetween(start, end, pageable);
    }

    // --- 2. ADD TRANSACTION ---
    @PostMapping
    public Transaction addTransaction(@RequestBody TransactionDTO transactionDTO) {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionService.createTransaction(transactionDTO, user);
    }

    // --- 3. DELETE TRANSACTION ---
    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));
        transactionService.deleteTransaction(id, user);
    }

    // --- 4. DASHBOARD STATS ---
    @GetMapping("/stats")
    public StatsDTO getStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        User user = userRepository.findById(1L).orElseThrow();

        // Default to Last 30 Days if no date provided
        LocalDate end = (endDate != null) ? LocalDate.parse(endDate) : LocalDate.now();
        LocalDate start = (startDate != null) ? LocalDate.parse(startDate) : LocalDate.now().minusDays(30);

        return transactionService.getDashboardStats(user, start, end);
    }

    // --- 5. CHART STATS ---
    @GetMapping("/stats/chart")
    public List<CategoryStatsDTO> getChartStats() {
        User user = userRepository.findById(1L).orElseThrow();
        return transactionService.getExpenseStats(user);
    }

    // --- 6. EXPORT CSV ---
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportTransactions(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        List<Transaction> transactions = transactionService.findTransactionsByDateRange(user, start, end);

        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("Date,Category,Description,Type,Amount\n");

        for (Transaction t : transactions) {
            csvBuilder.append(t.getDate()).append(",");
            csvBuilder.append(t.getCategory() != null ? t.getCategory().getName() : "Uncategorized").append(",");
            csvBuilder.append("\"").append(t.getDescription()).append("\",");
            csvBuilder.append(t.getType()).append(",");
            csvBuilder.append(t.getAmount()).append("\n");
        }

        byte[] csvBytes = csvBuilder.toString().getBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }

    // --- 7. IMPORT CSV ---
    @PostMapping("/import")
    public ResponseEntity<String> importTransactions(@RequestParam("file") MultipartFile file) {
        try {
            csvImportService.saveTransactionsFromCsv(file);
            return ResponseEntity.ok("Transactions imported successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error importing file: " + e.getMessage());
        }
    }

    @GetMapping("/stats/monthly")
    public List<com.finance.tracker.dto.MonthlyStatsDTO> getMonthlyStats() {
        User user = userRepository.findById(1L).orElseThrow();
        return transactionService.getMonthlyStats(user);
    }
}