package com.pawfund.modules.pet.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PetDTO {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private Integer age;
    private String gender;
    private String description;
    private String healthStatus;
    private String imageUrl;
    private String status;
    private Long shelterId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
