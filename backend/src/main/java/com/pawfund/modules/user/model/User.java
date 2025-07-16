package com.pawfund.modules.user.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role;

    private String phone;
    private String address;

    // Shelter specific fields
    @Column(name = "is_shelter")
    private boolean isShelter = false;

    @Column(name = "shelter_description")
    private String shelterDescription;

    @Column(name = "shelter_capacity")
    private Integer shelterCapacity;

    @Column(name = "operating_hours")
    private String operatingHours;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "social_media")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> socialMedia;

    // Volunteer specific fields
    @Column(name = "is_volunteer")
    private boolean isVolunteer = false;

    @Column(name = "volunteer_status")
    private String volunteerStatus;

    @Column(name = "skills")
    private String skills;

    @Column(name = "availability")
    private String availability;

    @Column(name = "volunteer_hours")
    private Integer volunteerHours = 0;

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
