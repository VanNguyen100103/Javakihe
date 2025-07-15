package com.pawfund.modules.shelter.model;

import com.pawfund.modules.user.model.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Entity
@Table(name = "shelter_profiles")
public class ShelterProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String description;
    private Integer capacity;

    @Column(name = "facilities", columnDefinition = "text[]")
    private List<String> facilities;

    private String requirements;

    @Column(name = "operating_hours")
    private String operatingHours;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "social_media")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> socialMedia;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
