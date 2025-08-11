package com.ecommerce.pawfund.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer age;
    private String breed;
    private String description;
    @Column(length = 1000)
    private String imageUrls; // Lưu "url1,url2,url3"
    private String location;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Boolean vaccinated;
    private Boolean dewormed;

    @ManyToOne
    @JoinColumn(name = "shelter_id")
    private User shelter;

    public enum Status {
        AVAILABLE, ADOPTED, PENDING
    }

    public enum Gender {
        MALE, FEMALE
    }

    // Getters, setters, constructors
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrls() { return imageUrls; }
    public void setImageUrls(String imageUrls) { this.imageUrls = imageUrls; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public Boolean getVaccinated() { return vaccinated; }
    public void setVaccinated(Boolean vaccinated) { this.vaccinated = vaccinated; }

    public Boolean getDewormed() { return dewormed; }
    public void setDewormed(Boolean dewormed) { this.dewormed = dewormed; }

    public User getShelter() { return shelter; }
    public void setShelter(User shelter) { this.shelter = shelter; }
} 