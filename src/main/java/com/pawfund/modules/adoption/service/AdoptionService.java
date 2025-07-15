package com.pawfund.modules.adoption.service;

import com.pawfund.modules.adoption.model.AdoptionRequest;
import com.pawfund.modules.adoption.repository.AdoptionRequestRepository;
import com.pawfund.modules.notification.service.NotificationService;
import com.pawfund.modules.pet.model.Pet;
import com.pawfund.modules.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdoptionService {
    private final AdoptionRequestRepository adoptionRequestRepository;
    private final NotificationService notificationService;

    public AdoptionService(AdoptionRequestRepository adoptionRequestRepository, NotificationService notificationService) {
        this.adoptionRequestRepository = adoptionRequestRepository;
        this.notificationService = notificationService;
    }

    public List<AdoptionRequest> getAdopterRequests(User adopter) {
        return adoptionRequestRepository.findByAdopter(adopter);
    }

    public List<AdoptionRequest> getPetRequests(Pet pet) {
        return adoptionRequestRepository.findByPet(pet);
    }

    @Transactional
    public AdoptionRequest createAdoptionRequest(Pet pet, User adopter, String reason) {
        // Check if there's already a pending request
        boolean hasPendingRequest = adoptionRequestRepository
                .existsByPetAndAdopterAndStatus(pet, adopter, AdoptionRequest.RequestStatus.PENDING);
        
        if (hasPendingRequest) {
            throw new IllegalStateException("You already have a pending request for this pet");
        }

        AdoptionRequest request = new AdoptionRequest();
        request.setPet(pet);
        request.setAdopter(adopter);
        request.setReason(reason);
        
        AdoptionRequest savedRequest = adoptionRequestRepository.save(request);
        
        // Notify the shelter
        notificationService.createNotification(
            pet.getShelter(),
            "New Adoption Request",
            "New adoption request for " + pet.getName(),
            "ADOPTION_REQUEST"
        );
        
        return savedRequest;
    }

    @Transactional
    public AdoptionRequest updateRequestStatus(Long requestId, AdoptionRequest.RequestStatus status, String notes) {
        AdoptionRequest request = adoptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Adoption request not found"));

        request.setStatus(status);
        request.setNotes(notes);
        request.setResponseDate(LocalDateTime.now());
        
        AdoptionRequest updatedRequest = adoptionRequestRepository.save(request);
        
        // Notify the adopter
        notificationService.createNotification(
            request.getAdopter(),
            "Adoption Request " + status.toString(),
            "Your adoption request for " + request.getPet().getName() + " has been " + status.toString().toLowerCase(),
            "ADOPTION_UPDATE"
        );
        
        return updatedRequest;
    }
}
