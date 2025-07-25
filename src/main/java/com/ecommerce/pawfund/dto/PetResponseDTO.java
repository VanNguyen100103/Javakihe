package com.ecommerce.pawfund.dto;

public class PetResponseDTO {
    private Long id;
    private String name;
    private String imageUrls;
    private String description;
    private int age;
    private String breed;
    private String location;
    private String status;
    private ShelterDTO shelter;

    // Getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getImageUrls() { return imageUrls; }
    public void setImageUrls(String imageUrls) { this.imageUrls = imageUrls; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public ShelterDTO getShelter() { return shelter; }
    public void setShelter(ShelterDTO shelter) { this.shelter = shelter; }
} 