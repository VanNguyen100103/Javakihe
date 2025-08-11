package com.ecommerce.pawfund.service.inter;

import com.ecommerce.pawfund.entity.Adoption;
import java.util.List;
import java.util.Optional;

public interface IAdoptionService {
    Optional<Adoption> findById(Long id);
    List<Adoption> findAll();
    Adoption save(Adoption application);
    void deleteById(Long id);
    List<Adoption> findByUserId(Long userId);
    List<Adoption> findByPetId(Long petId);
    List<Adoption> getAdoptionsByUserId(Long userId);
    
    // Admin/Shelter methods
    List<Adoption> getAllAdoptions();
    Adoption updateAdoptionStatus(Long adoptionId, String status, String adminNotes, String shelterNotes);
} 