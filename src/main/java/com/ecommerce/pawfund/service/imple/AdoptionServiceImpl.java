package com.ecommerce.pawfund.service.imple;

import com.ecommerce.pawfund.entity.Adoption;
import com.ecommerce.pawfund.repository.AdoptionRepository;
import com.ecommerce.pawfund.service.inter.IAdoptionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdoptionServiceImpl implements IAdoptionService {
    @Autowired
    private AdoptionRepository adoptionRepository;

    @Override
    public Optional<Adoption> findById(Long id) {
        return adoptionRepository.findById(id);
    }

    @Override
    public List<Adoption> findAll() {
        return adoptionRepository.findAll();
    }

    @Override
    public Adoption save(Adoption application) {
        return adoptionRepository.save(application);
    }

    @Override
    public void deleteById(Long id) {
        adoptionRepository.deleteById(id);
    }

    @Override
    public List<Adoption> findByUserId(Long userId) {
        return adoptionRepository.findByUserId(userId);
    }

    @Override
    public List<Adoption> findByPetId(Long petId) {
        return adoptionRepository.findByPetId(petId);
    }

    @Override
    public List<Adoption> getAdoptionsByUserId(Long userId) {
        return adoptionRepository.findByUserId(userId);
    }
    
    @Override
    public List<Adoption> getAllAdoptions() {
        return adoptionRepository.findAll();
    }
    
    @Override
    public Adoption updateAdoptionStatus(Long adoptionId, String status, String adminNotes, String shelterNotes) {
        System.out.println("=== updateAdoptionStatus service called ===");
        System.out.println("adoptionId: " + adoptionId);
        System.out.println("status: " + status);
        System.out.println("adminNotes: " + adminNotes);
        System.out.println("shelterNotes: " + shelterNotes);
        
        Adoption adoption = adoptionRepository.findById(adoptionId)
                .orElseThrow(() -> new RuntimeException("Adoption not found"));
        
        System.out.println("=== Found adoption: " + adoption.getId() + " with current status: " + adoption.getStatus() + " ===");
        
        adoption.setStatus(Adoption.Status.valueOf(status.toUpperCase()));
        
        if (adminNotes != null && !adminNotes.trim().isEmpty()) {
            adoption.setAdminNotes(adminNotes);
        }
        
        if (shelterNotes != null && !shelterNotes.trim().isEmpty()) {
            adoption.setShelterNotes(shelterNotes);
        }
        
        Adoption saved = adoptionRepository.save(adoption);
        System.out.println("=== Saved adoption with new status: " + saved.getStatus() + " ===");
        
        return saved;
    }
} 