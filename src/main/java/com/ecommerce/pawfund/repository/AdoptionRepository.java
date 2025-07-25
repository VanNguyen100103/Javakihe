package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.Adoption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface AdoptionRepository extends JpaRepository<Adoption, Long>, CrudRepository<Adoption, Long> {
    List<Adoption> findByUserId(Long userId);
    List<Adoption> findByPetId(Long petId);
} 