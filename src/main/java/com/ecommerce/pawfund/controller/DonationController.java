package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.Donation;
import com.ecommerce.pawfund.notification.NotificationService;
import com.ecommerce.pawfund.repository.UserRepository;
import com.ecommerce.pawfund.service.inter.IDonationService;
import com.ecommerce.pawfund.service.inter.IPayPalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/donations")
public class DonationController {
    private final IDonationService donationService;

    private final NotificationService notificationService;

    private final UserRepository userRepository;

    private final IPayPalService payPalService;

    public DonationController(IDonationService donationService, NotificationService notificationService, UserRepository userRepository, IPayPalService payPalService) {
        this.donationService = donationService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.payPalService = payPalService;
    }

    @GetMapping
    public List<Donation> getAllDonations(@RequestParam(required = false) Long userId) {
        if (userId != null) return donationService.findByUserId(userId);
        return donationService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable Long id) {
        Optional<Donation> donation = donationService.findById(id);
        return donation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('DONOR','ADOPTER','VOLUNTEER','SHELTER','ADMIN')")
    @PostMapping(consumes = {"application/x-www-form-urlencoded", "application/json"})
    public Donation createDonation(@RequestBody Donation donation) {
        // Debug logging
        System.out.println("=== Create Donation Debug ===");
        System.out.println("Received donation: " + donation);
        System.out.println("userId: " + donation.getUserId());
        System.out.println("user: " + donation.getUser());
        
        if (donation.getUserId() != null) {
            userRepository.findById(donation.getUserId()).ifPresent(donation::setUser);
        }
        
        // Set donation timestamp if not provided
        if (donation.getDonatedAt() == null) {
            donation.setDonatedAt(java.time.LocalDateTime.now());
        }
        
        // Map paymentMethod to method if method is null
        if (donation.getMethod() == null && donation.getPaymentMethod() != null) {
            donation.setMethod(donation.getPaymentMethod());
        }
        
        // Map method to paymentMethod if paymentMethod is null
        if (donation.getPaymentMethod() == null && donation.getMethod() != null) {
            donation.setPaymentMethod(donation.getMethod());
        }
        
        Donation saved = donationService.save(donation);
        // Gửi email cảm ơn cho donor
        if (saved.getUser() != null && saved.getUser().getEmail() != null) {
            String subject = "Cảm ơn bạn đã quyên góp!";
            String text = "Cảm ơn bạn đã quyên góp số tiền: " + (saved.getAmount() != null ? saved.getAmount() : "") +
                " bằng phương thức: " + (saved.getMethod() != null ? saved.getMethod() : "") + ". Chúng tôi rất trân trọng sự đóng góp của bạn cho các thú cưng bị bỏ rơi.";
            notificationService.sendEmail(saved.getUser().getEmail(), subject, text);
        }
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donation> updateDonation(@PathVariable Long id, @RequestBody Donation donation) {
        Optional<Donation> existing = donationService.findById(id);
        if (existing.isPresent()) {
            donation.setId(id);
            return ResponseEntity.ok(donationService.save(donation));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long id) {
        if (donationService.findById(id).isPresent()) {
            donationService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Donation statistics endpoint - Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getDonationStatistics() {
        try {
            System.out.println("=== getDonationStatistics called ===");
            List<Donation> allDonations = donationService.findAll();
            System.out.println("=== Found " + allDonations.size() + " donations ===");
            
            // Calculate statistics
            long totalDonations = allDonations.size();
            double totalAmount = allDonations.stream()
                .mapToDouble(donation -> donation.getAmount() != null ? donation.getAmount() : 0.0)
                .sum();
            
            // Count unique donors
            long uniqueDonors = allDonations.stream()
                .filter(donation -> donation.getUser() != null)
                .map(donation -> donation.getUser().getId())
                .distinct()
                .count();
            
            // Calculate this month's donations
            java.time.LocalDateTime startOfMonth = java.time.LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
            
            double thisMonthAmount = allDonations.stream()
                .filter(donation -> donation.getDonatedAt() != null && 
                        donation.getDonatedAt().isAfter(startOfMonth))
                .mapToDouble(donation -> donation.getAmount() != null ? donation.getAmount() : 0.0)
                .sum();
            
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalDonations", totalDonations);
            statistics.put("totalAmount", totalAmount);
            statistics.put("uniqueDonors", uniqueDonors);
            statistics.put("thisMonthAmount", thisMonthAmount);
            statistics.put("monthlyGoal", 50000000.0); // 50,000,000 VND goal
            statistics.put("progressPercentage", (thisMonthAmount / 50000000.0) * 100);
            
            System.out.println("=== Returning statistics: " + statistics + " ===");
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            System.err.println("=== Error in getDonationStatistics: " + e.getMessage() + " ===");
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get donation statistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PayPal endpoints
    @GetMapping("/paypal/client-id")
    public ResponseEntity<Map<String, String>> getPayPalClientId() {
        return ResponseEntity.ok(payPalService.getClientId());
    }

    @PostMapping("/paypal/create-order")
    public ResponseEntity<Map<String, Object>> createPayPalOrder(@RequestBody Map<String, Object> orderData) {
        try {
            Map<String, Object> result = payPalService.createOrder(orderData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/paypal/capture/{orderId}")
    public ResponseEntity<Map<String, Object>> capturePayPalPayment(@PathVariable String orderId) {
        try {
            Map<String, Object> result = payPalService.capturePayment(orderId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/paypal/verify")
    public ResponseEntity<Map<String, Object>> verifyPayPalPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            boolean isValid = payPalService.verifyPayment(paymentData);
            return ResponseEntity.ok(Map.of("verified", isValid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PayPal callback endpoints
    @GetMapping("/success")
    public ResponseEntity<Map<String, Object>> handlePayPalSuccess(
            @RequestParam("token") String token,
            @RequestParam("PayerID") String payerId,
            @RequestParam(value = "amount", required = false) String amount) {
        try {
            // Capture the payment using the token
            Map<String, Object> captureResult = payPalService.capturePayment(token);
            
            // Create donation record
            Donation donation = new Donation();
            // Use amount from request parameter or default to 0
            if (amount != null && !amount.isEmpty()) {
                donation.setAmount(Double.parseDouble(amount));
            } else {
                donation.setAmount(0.0); // Default amount if not provided
            }
            donation.setMethod("PayPal");
            donation.setPaymentMethod("PayPal");
            donation.setStatus("COMPLETED");
            donation.setTransactionId((String) captureResult.get("transactionId"));
            donation.setDonatedAt(java.time.LocalDateTime.now());
            
            // Save the donation
            Donation savedDonation = donationService.save(donation);
            
            // Send thank you email
            if (savedDonation.getUser() != null && savedDonation.getUser().getEmail() != null) {
                String subject = "Cảm ơn bạn đã quyên góp qua PayPal!";
                String text = "Cảm ơn bạn đã quyên góp số tiền: " + savedDonation.getAmount() + 
                    " USD qua PayPal. Giao dịch ID: " + savedDonation.getTransactionId() + 
                    ". Chúng tôi rất trân trọng sự đóng góp của bạn cho các thú cưng bị bỏ rơi.";
                notificationService.sendEmail(savedDonation.getUser().getEmail(), subject, text);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thanh toán thành công!");
            response.put("donationId", savedDonation.getId());
            response.put("transactionId", savedDonation.getTransactionId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/cancel")
    public ResponseEntity<Map<String, Object>> handlePayPalCancel() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Thanh toán đã bị hủy bởi người dùng.");
        return ResponseEntity.ok(response);
    }
} 