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
} 