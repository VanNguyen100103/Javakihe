package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUser_Id(Long userId);
} 