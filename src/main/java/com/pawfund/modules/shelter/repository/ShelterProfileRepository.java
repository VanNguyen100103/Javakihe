package com.pawfund.modules.shelter.repository;

import com.pawfund.modules.shelter.model.ShelterProfile;
import com.pawfund.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShelterProfileRepository extends JpaRepository<ShelterProfile, Long> {
    Optional<ShelterProfile> findByUser(User user);
    
    @Query("SELECT s FROM ShelterProfile s WHERE s.capacity > (SELECT COUNT(p) FROM Pet p WHERE p.shelter = s.user)")
    List<ShelterProfile> findSheltersWithAvailableCapacity();
    
    @Query("SELECT s FROM ShelterProfile s WHERE :facility = ANY(s.facilities)")
    List<ShelterProfile> findByFacility(String facility);
}
