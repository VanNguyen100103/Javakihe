package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    // Find events by shelter (multiple relationship)
    @Query("SELECT e FROM Event e JOIN e.shelters s WHERE s.id = :shelterId")
    List<Event> findByShelterId(@Param("shelterId") Long shelterId);
    
    // Find events by volunteer (multiple relationship)
    @Query("SELECT e FROM Event e JOIN e.volunteers v WHERE v.id = :volunteerId")
    List<Event> findByVolunteerId(@Param("volunteerId") Long volunteerId);
    
    // Find events by donor (multiple relationship)
    @Query("SELECT e FROM Event e JOIN e.donors d WHERE d.id = :donorId")
    List<Event> findByDonorId(@Param("donorId") Long donorId);
} 