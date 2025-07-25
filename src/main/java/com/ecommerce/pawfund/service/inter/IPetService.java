package com.ecommerce.pawfund.service.inter;

import com.ecommerce.pawfund.entity.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface IPetService {
    Optional<Pet> findById(Long id);
    List<Pet> findAll();
    Pet save(Pet pet);
    void deleteById(Long id);
    List<Pet> findByBreed(String breed);
    List<Pet> findByStatus(Pet.Status status);
    List<Pet> findByLocation(String location);
    Page<Pet> findByFilterAndSearch(String status, String breed, String search, Integer age, String location, Integer ageMin, Integer ageMax, Pageable pageable);
} 