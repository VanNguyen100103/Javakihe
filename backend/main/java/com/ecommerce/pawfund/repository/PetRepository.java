package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByBreed(String breed);
    List<Pet> findByStatus(Pet.Status status);
    List<Pet> findByLocation(String location);

    // Đã xoá method findByFilter dùng @Query JPQL
} 