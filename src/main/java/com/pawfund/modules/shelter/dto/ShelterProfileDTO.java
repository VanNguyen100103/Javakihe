package com.pawfund.modules.shelter.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class ShelterProfileDTO {
    private Long id;
    private Long userId;
    private String description;
    private Integer capacity;
    private List<String> facilities;
    private String requirements;
    private String operatingHours;
    private String emergencyContact;
    private String websiteUrl;
    private Map<String, String> socialMedia;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional fields for statistics
    private Integer currentPetCount;
    private Integer totalAdoptions;
    private Double totalDonations;
}
