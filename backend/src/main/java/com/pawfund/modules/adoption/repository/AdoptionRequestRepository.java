package com.pawfund.modules.adoption.repository;

import com.pawfund.modules.adoption.model.AdoptionRequest;
import com.pawfund.modules.pet.model.Pet;
import com.pawfund.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
    List<AdoptionRequest> findByAdopter(User adopter);
    List<AdoptionRequest> findByPet(Pet pet);
    List<AdoptionRequest> findByPetAndStatus(Pet pet, AdoptionRequest.RequestStatus status);
    List<AdoptionRequest> findByAdopterAndStatus(User adopter, AdoptionRequest.RequestStatus status);
    boolean existsByPetAndAdopterAndStatus(Pet pet, User adopter, AdoptionRequest.RequestStatus status);
}
