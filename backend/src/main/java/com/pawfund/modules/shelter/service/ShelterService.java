package com.pawfund.modules.shelter.service;

import com.pawfund.modules.shelter.dto.ShelterProfileDTO;
import com.pawfund.modules.shelter.model.ShelterProfile;
import com.pawfund.modules.shelter.repository.ShelterProfileRepository;
import com.pawfund.modules.user.model.User;
import com.pawfund.modules.user.repository.UserRepository;
import com.pawfund.modules.pet.repository.PetRepository;
import com.pawfund.modules.adoption.repository.AdoptionRequestRepository;
import com.pawfund.modules.donation.repository.DonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShelterService {
    private final ShelterProfileRepository shelterProfileRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final AdoptionRequestRepository adoptionRequestRepository;
    private final DonationRepository donationRepository;

    public ShelterService(
            ShelterProfileRepository shelterProfileRepository,
            UserRepository userRepository,
            PetRepository petRepository,
            AdoptionRequestRepository adoptionRequestRepository,
            DonationRepository donationRepository) {
        this.shelterProfileRepository = shelterProfileRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.adoptionRequestRepository = adoptionRequestRepository;
        this.donationRepository = donationRepository;
    }

    public List<ShelterProfileDTO> getAllShelters() {
        return shelterProfileRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ShelterProfileDTO> getSheltersWithAvailableCapacity() {
        return shelterProfileRepository.findSheltersWithAvailableCapacity().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShelterProfileDTO createShelterProfile(Long userId, ShelterProfileDTO profileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (shelterProfileRepository.findByUser(user).isPresent()) {
            throw new IllegalStateException("Shelter profile already exists for this user");
        }

        ShelterProfile profile = new ShelterProfile();
        updateProfileFromDTO(profile, profileDTO);
        profile.setUser(user);

        return convertToDTO(shelterProfileRepository.save(profile));
    }

    @Transactional
    public ShelterProfileDTO updateShelterProfile(Long profileId, ShelterProfileDTO profileDTO) {
        ShelterProfile profile = shelterProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Shelter profile not found"));

        updateProfileFromDTO(profile, profileDTO);
        return convertToDTO(shelterProfileRepository.save(profile));
    }

    private void updateProfileFromDTO(ShelterProfile profile, ShelterProfileDTO dto) {
        profile.setDescription(dto.getDescription());
        profile.setCapacity(dto.getCapacity());
        profile.setFacilities(dto.getFacilities());
        profile.setRequirements(dto.getRequirements());
        profile.setOperatingHours(dto.getOperatingHours());
        profile.setEmergencyContact(dto.getEmergencyContact());
        profile.setWebsiteUrl(dto.getWebsiteUrl());
        profile.setSocialMedia(dto.getSocialMedia());
    }

    private ShelterProfileDTO convertToDTO(ShelterProfile profile) {
        ShelterProfileDTO dto = new ShelterProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setDescription(profile.getDescription());
        dto.setCapacity(profile.getCapacity());
        dto.setFacilities(profile.getFacilities());
        dto.setRequirements(profile.getRequirements());
        dto.setOperatingHours(profile.getOperatingHours());
        dto.setEmergencyContact(profile.getEmergencyContact());
        dto.setWebsiteUrl(profile.getWebsiteUrl());
        dto.setSocialMedia(profile.getSocialMedia());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());

        // Add statistics
        dto.setCurrentPetCount(petRepository.countByShelterId(profile.getUser().getId()));
        dto.setTotalAdoptions(adoptionRequestRepository.countCompletedAdoptionsByShelterId(profile.getUser().getId()));
        dto.setTotalDonations(donationRepository.getTotalDonationsForShelter(profile.getUser()).doubleValue());

        return dto;
    }
}
