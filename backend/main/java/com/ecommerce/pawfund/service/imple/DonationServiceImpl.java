package com.ecommerce.pawfund.service.imple;

import com.ecommerce.pawfund.entity.Donation;
import com.ecommerce.pawfund.repository.DonationRepository;
import com.ecommerce.pawfund.service.inter.IDonationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DonationServiceImpl implements IDonationService {
    @Autowired
    private DonationRepository donationRepository;

    @Override
    public Optional<Donation> findById(Long id) {
        return donationRepository.findById(id);
    }

    @Override
    public List<Donation> findAll() {
        return donationRepository.findAll();
    }

    @Override
    public Donation save(Donation donation) {
        return donationRepository.save(donation);
    }

    @Override
    public void deleteById(Long id) {
        donationRepository.deleteById(id);
    }

    @Override
    public List<Donation> findByUserId(Long userId) {
        return donationRepository.findByUser_Id(userId);
    }
} 