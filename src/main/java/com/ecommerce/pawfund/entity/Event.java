package com.ecommerce.pawfund.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime date;
    private String location;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    private String startTime;
    private String endTime;
    private Integer maxParticipants;

    @ManyToMany
    @JoinTable(
        name = "event_shelters",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "shelter_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "refreshTokens", "verificationTokens"})
    private List<User> shelters = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "event_volunteers",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "volunteer_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "refreshTokens", "verificationTokens"})
    private List<User> volunteers = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "event_donors",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "donor_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "refreshTokens", "verificationTokens"})
    private List<User> donors = new ArrayList<>();

    public enum Category {
        ADOPTION, FUNDRAISING, VOLUNTEER, EDUCATION, OTHER
    }

    public enum Status {
        UPCOMING, ONGOING, COMPLETED, CANCELLED
    }

    // Getters, setters, constructors
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public List<User> getShelters() { return shelters; }
    public void setShelters(List<User> shelters) { this.shelters = shelters; }
    
    public List<User> getVolunteers() { return volunteers; }
    public void setVolunteers(List<User> volunteers) { this.volunteers = volunteers; }

    public List<User> getDonors() { return donors; }
    public void setDonors(List<User> donors) { this.donors = donors; }
    
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
} 