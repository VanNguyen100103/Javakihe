package com.ecommerce.pawfund.service.inter;

import com.ecommerce.pawfund.entity.Donation;
import java.util.List;
import java.util.Optional;

public interface IDonationService {
    Optional<Donation> findById(Long id);
    List<Donation> findAll();
    Donation save(Donation donation);
    void deleteById(Long id);
    List<Donation> findByUserId(Long userId);
} 