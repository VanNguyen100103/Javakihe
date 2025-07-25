package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.Donation;
import com.ecommerce.pawfund.notification.NotificationService;
import com.ecommerce.pawfund.service.inter.IDonationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
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
    public Donation createDonation(@ModelAttribute Donation donation) {
        if (donation.getUserId() != null) {
            userRepository.findById(donation.getUserId()).ifPresent(donation::setUser);
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
} 