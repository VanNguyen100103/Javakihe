package com.pawfund.modules.donation.repository;

import com.pawfund.modules.donation.model.Donation;
import com.pawfund.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonorOrderByDonationDateDesc(User donor);
    List<Donation> findByShelterOrderByDonationDateDesc(User shelter);
    
    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.shelter = ?1")
    BigDecimal getTotalDonationsForShelter(User shelter);
    
    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.donor = ?1")
    BigDecimal getTotalDonationsByDonor(User donor);
}
