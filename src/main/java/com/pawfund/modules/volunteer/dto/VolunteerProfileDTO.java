package com.pawfund.modules.volunteer.dto;

import com.pawfund.modules.common.enums.VolunteerStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VolunteerProfileDTO {
    private Long id;
    private Long userId;
    private List<String> skills;
    private String availability;
    private String experience;
    private VolunteerStatus status;
    private Integer totalHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
