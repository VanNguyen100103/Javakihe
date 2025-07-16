package com.pawfund.modules.donation.model;

import com.pawfund.modules.user.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id")
    private User donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_id")
    private User shelter;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private String message;

    @Column(name = "is_anonymous")
    private boolean isAnonymous;

    @Column(name = "donation_date", nullable = false)
    private LocalDateTime donationDate;

    @PrePersist
    protected void onCreate() {
        donationDate = LocalDateTime.now();
    }
}
