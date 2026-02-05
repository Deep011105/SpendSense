package com.finance.tracker.controller;

import com.finance.tracker.dto.CategoryStatsDTO;
import com.finance.tracker.dto.StatsDTO;
import com.finance.tracker.dto.TransactionDTO;
import com.finance.tracker.model.Transaction;
import com.finance.tracker.model.User;
import com.finance.tracker.repo.UserRepo;
import com.finance.tracker.service.TransactionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173") // Allow React to talk to Spring
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepo userRepository;

    public TransactionController(TransactionService transactionService, UserRepo userRepository) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    // GET /api/transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {
        // TODO: Replace with currently logged-in user
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionService.findAllByUser(user);
    }

    // POST /api/transactions
    @PostMapping
    public Transaction addTransaction(@RequestBody TransactionDTO transactionDTO) {
        // TODO: Replace with currently logged-in user
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionService.createTransaction(transactionDTO, user);
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        // TODO: Replace with currently logged-in user
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

        transactionService.deleteTransaction(id, user);
    }

    // Add this new endpoint
    @GetMapping("/stats")
    public StatsDTO getStats() {
        // TODO: Still using User ID 1 until we finish Security
        User user = userRepository.findById(1L).orElseThrow();
        return transactionService.getDashboardStats(user);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportTransactions(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        // 1. Get the User (Hardcoded 1L until security is added)
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Parse Dates
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        // 3. Fetch Data (Using the new Service method from Step 2)
        List<Transaction> transactions = transactionService.findTransactionsByDateRange(user, start, end);

        // 4. Build CSV String
        StringBuilder csvBuilder = new StringBuilder();
        // Add Header Row
        csvBuilder.append("Date,Category,Description,Type,Amount\n");

        for (Transaction t : transactions) {
            csvBuilder.append(t.getDate()).append(",");
            csvBuilder.append(t.getCategory()).append(",");
            // Escape commas in description to avoid breaking the CSV format
            csvBuilder.append("\"").append(t.getDescription()).append("\",");
            csvBuilder.append(t.getType()).append(",");
            csvBuilder.append(t.getAmount()).append("\n");
        }

        // 5. Convert to Bytes
        byte[] csvBytes = csvBuilder.toString().getBytes();

        // 6. Return as a File Download
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }

    @GetMapping("/stats/chart")
    public List<CategoryStatsDTO> getChartStats() {
        User user = userRepository.findById(1L).orElseThrow();
        return transactionService.getExpenseStats(user);
    }
}