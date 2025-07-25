package com.ecommerce.pawfund.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "guest_carts")
public class GuestCart {
    @Id
    private String token; // UUID

    @ElementCollection
    private List<Long> petIds = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public List<Long> getPetIds() { return petIds; }
    public void setPetIds(List<Long> petIds) { this.petIds = petIds; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 