package com.pawfund.modules.volunteer.service;

import com.pawfund.modules.common.enums.VolunteerStatus;
import com.pawfund.modules.volunteer.dto.VolunteerProfileDTO;
import com.pawfund.modules.volunteer.model.VolunteerProfile;
import com.pawfund.modules.volunteer.repository.VolunteerProfileRepository;
import com.pawfund.modules.user.model.User;
import com.pawfund.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VolunteerService {
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final UserRepository userRepository;

    public VolunteerService(VolunteerProfileRepository volunteerProfileRepository, UserRepository userRepository) {
        this.volunteerProfileRepository = volunteerProfileRepository;
        this.userRepository = userRepository;
    }

    public List<VolunteerProfileDTO> getAllVolunteers() {
        return volunteerProfileRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VolunteerProfileDTO> getVolunteersByStatus(VolunteerStatus status) {
        return volunteerProfileRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VolunteerProfileDTO> getVolunteersBySkill(String skill) {
        return volunteerProfileRepository.findBySkill(skill).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public VolunteerProfileDTO createVolunteerProfile(Long userId, VolunteerProfileDTO profileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (volunteerProfileRepository.findByUser(user).isPresent()) {
            throw new IllegalStateException("Volunteer profile already exists for this user");
        }

        VolunteerProfile profile = new VolunteerProfile();
        profile.setUser(user);
        profile.setSkills(profileDTO.getSkills());
        profile.setAvailability(profileDTO.getAvailability());
        profile.setExperience(profileDTO.getExperience());
        profile.setStatus(VolunteerStatus.PENDING);

        return convertToDTO(volunteerProfileRepository.save(profile));
    }

    @Transactional
    public VolunteerProfileDTO updateVolunteerStatus(Long profileId, VolunteerStatus status) {
        VolunteerProfile profile = volunteerProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Volunteer profile not found"));

        profile.setStatus(status);
        return convertToDTO(volunteerProfileRepository.save(profile));
    }

    @Transactional
    public VolunteerProfileDTO updateVolunteerHours(Long profileId, Integer additionalHours) {
        VolunteerProfile profile = volunteerProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Volunteer profile not found"));

        profile.setTotalHours(profile.getTotalHours() + additionalHours);
        return convertToDTO(volunteerProfileRepository.save(profile));
    }

    private VolunteerProfileDTO convertToDTO(VolunteerProfile profile) {
        VolunteerProfileDTO dto = new VolunteerProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setSkills(profile.getSkills());
        dto.setAvailability(profile.getAvailability());
        dto.setExperience(profile.getExperience());
        dto.setStatus(profile.getStatus());
        dto.setTotalHours(profile.getTotalHours());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }
}
