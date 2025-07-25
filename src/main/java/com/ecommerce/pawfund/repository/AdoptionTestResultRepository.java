package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.AdoptionTestResult;
import com.ecommerce.pawfund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdoptionTestResultRepository extends JpaRepository<AdoptionTestResult, Long> {
    Optional<AdoptionTestResult> findTopByUserOrderByCreatedAtDesc(User user);
} 