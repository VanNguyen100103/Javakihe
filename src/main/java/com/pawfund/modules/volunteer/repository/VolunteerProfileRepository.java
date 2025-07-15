package com.pawfund.modules.volunteer.repository;

import com.pawfund.modules.common.enums.VolunteerStatus;
import com.pawfund.modules.volunteer.model.VolunteerProfile;
import com.pawfund.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerProfileRepository extends JpaRepository<VolunteerProfile, Long> {
    Optional<VolunteerProfile> findByUser(User user);
    List<VolunteerProfile> findByStatus(VolunteerStatus status);
    
    @Query("SELECT v FROM VolunteerProfile v WHERE :skill = ANY(v.skills) AND v.status = 'ACTIVE'")
    List<VolunteerProfile> findBySkill(String skill);
    
    @Query("SELECT SUM(v.totalHours) FROM VolunteerProfile v WHERE v.user = ?1")
    Integer getTotalVolunteerHours(User user);
}
