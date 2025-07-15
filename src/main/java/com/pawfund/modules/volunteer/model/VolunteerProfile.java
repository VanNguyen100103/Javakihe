package com.pawfund.modules.volunteer.model;

import com.pawfund.modules.common.enums.VolunteerStatus;
import com.pawfund.modules.user.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "volunteer_profiles")
public class VolunteerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "skills", columnDefinition = "text[]")
    private List<String> skills;

    private String availability;
    private String experience;

    @Enumerated(EnumType.STRING)
    private VolunteerStatus status;

    @Column(name = "total_hours")
    private Integer totalHours = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = VolunteerStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
