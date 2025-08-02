package com.ecommerce.pawfund.dto;

public class AdoptionRequestDTO {
    private Long petId;
    private String message;

    public Long getPetId() {
        return petId;
    }
    public void setPetId(Long petId) {
        this.petId = petId;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
} 