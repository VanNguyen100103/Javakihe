package com.pawfund.modules.pet.repository;

import com.pawfund.modules.pet.model.Pet;
import com.pawfund.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByStatus(String status);
    List<Pet> findByShelter(User shelter);
    List<Pet> findBySpecies(String species);
}
