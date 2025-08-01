package com.ecommerce.pawfund.dto;

import java.time.LocalDateTime;
import java.util.List;

public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime date;
    private String location;
    private String category;
    private String status;
    private String startTime;
    private String endTime;
    private Integer maxParticipants;
    private List<Long> shelterIds;
    private List<String> shelterNames;
    private List<Long> volunteerIds;
    private List<String> volunteerNames;
    private List<Long> donorIds;
    private List<String> donorNames;

    // Constructors
    public EventDTO() {}

    public EventDTO(Long id, String title, String description, LocalDateTime date, String location,
                   String category, String status, String startTime, String endTime,
                   Integer maxParticipants, List<Long> shelterIds, List<String> shelterNames, 
                   List<Long> volunteerIds, List<String> volunteerNames,
                   List<Long> donorIds, List<String> donorNames) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.location = location;
        this.category = category;
        this.status = status;
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxParticipants = maxParticipants;
        this.shelterIds = shelterIds;
        this.shelterNames = shelterNames;
        this.volunteerIds = volunteerIds;
        this.volunteerNames = volunteerNames;
        this.donorIds = donorIds;
        this.donorNames = donorNames;
    }

    // Getters and Setters
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

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public List<Long> getShelterIds() { return shelterIds; }
    public void setShelterIds(List<Long> shelterIds) { this.shelterIds = shelterIds; }

    public List<String> getShelterNames() { return shelterNames; }
    public void setShelterNames(List<String> shelterNames) { this.shelterNames = shelterNames; }

    public List<Long> getVolunteerIds() { return volunteerIds; }
    public void setVolunteerIds(List<Long> volunteerIds) { this.volunteerIds = volunteerIds; }

    public List<String> getVolunteerNames() { return volunteerNames; }
    public void setVolunteerNames(List<String> volunteerNames) { this.volunteerNames = volunteerNames; }

    public List<Long> getDonorIds() { return donorIds; }
    public void setDonorIds(List<Long> donorIds) { this.donorIds = donorIds; }

    public List<String> getDonorNames() { return donorNames; }
    public void setDonorNames(List<String> donorNames) { this.donorNames = donorNames; }
   
} 