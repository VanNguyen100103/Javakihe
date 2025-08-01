package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.Donation;
import com.ecommerce.pawfund.notification.NotificationService;
import com.ecommerce.pawfund.service.inter.IDonationService;
import com.ecommerce.pawfund.service.inter.IPayPalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import com.ecommerce.pawfund.repository.UserRepository;

@RestController
@RequestMapping("/api/donations")
public class DonationController {
    @Autowired
    private IDonationService donationService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IPayPalService payPalService;

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
} 