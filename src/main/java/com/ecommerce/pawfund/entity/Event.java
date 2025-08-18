package com.ecommerce.pawfund.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "events")
public class Event {
    // Getters, setters, constructors
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

    @ManyToOne
    @JoinColumn(name = "main_shelter_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "refreshTokens", "verificationTokens"})
    private User mainShelter;

    @ManyToMany
    @JoinTable(
        name = "event_collaborators",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "collaborator_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "refreshTokens", "verificationTokens"})
    private List<User> collaborators = new ArrayList<>();

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

    @ManyToMany
    @JoinTable(
            name = "event_shelters", // Tên bảng trung gian để lưu mối quan hệ này
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "shelter_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "refreshTokens", "verificationTokens"})
    private List<User> shelters = new ArrayList<>();



    public enum Category {
        ADOPTION, FUNDRAISING, VOLUNTEER, EDUCATION, OTHER
    }

    public enum Status {
        UPCOMING, ONGOING, COMPLETED, CANCELLED
    }
}