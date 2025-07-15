package com.pawfund.modules.pet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PetCreateDTO {
    @NotBlank(message = "Pet name is required")
    private String name;

    @NotBlank(message = "Species is required")
    private String species;

    private String breed;

    @Positive(message = "Age must be positive")
    private Integer age;

    private String gender;
    private String description;
    private String healthStatus;
    private String imageUrl;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Shelter ID is required")
    private Long shelterId;
}
