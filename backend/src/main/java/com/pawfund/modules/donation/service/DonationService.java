package com.pawfund.modules.donation.service;

import com.pawfund.modules.donation.model.Donation;
import com.pawfund.modules.donation.repository.DonationRepository;
import com.pawfund.modules.notification.service.NotificationService;
import com.pawfund.modules.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DonationService {
    private final DonationRepository donationRepository;
    private final NotificationService notificationService;

    public DonationService(DonationRepository donationRepository, NotificationService notificationService) {
        this.donationRepository = donationRepository;
        this.notificationService = notificationService;
    }

    public List<Donation> getDonorDonations(User donor) {
        return donationRepository.findByDonorOrderByDonationDateDesc(donor);
    }

    public List<Donation> getShelterDonations(User shelter) {
        return donationRepository.findByShelterOrderByDonationDateDesc(shelter);
    }

    public BigDecimal getTotalDonationsForShelter(User shelter) {
        return donationRepository.getTotalDonationsForShelter(shelter);
    }

    public BigDecimal getTotalDonationsByDonor(User donor) {
        return donationRepository.getTotalDonationsByDonor(donor);
    }

    @Transactional
    public Donation createDonation(User donor, User shelter, BigDecimal amount, String message, boolean isAnonymous) {
        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setShelter(shelter);
        donation.setAmount(amount);
        donation.setMessage(message);
        donation.setAnonymous(isAnonymous);
        
        Donation savedDonation = donationRepository.save(donation);
        
        // Notify the shelter
        String donorName = isAnonymous ? "Anonymous" : donor.getFullName();
        notificationService.createNotification(
            shelter,
            "New Donation Received",
            String.format("You received a donation of $%.2f from %s", amount, donorName),
            "DONATION"
        );
        
        return savedDonation;
    }
}
