package com.pawfund.modules.event.repository;

import com.pawfund.modules.event.model.Event;
import com.pawfund.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizer(User organizer);
    List<Event> findByStatus(String status);
    
    @Query("SELECT e FROM Event e WHERE e.startDate > ?1 ORDER BY e.startDate")
    List<Event> findUpcomingEvents(LocalDateTime now);
    
    @Query("SELECT e FROM Event e WHERE e.startDate BETWEEN ?1 AND ?2")
    List<Event> findEventsBetweenDates(LocalDateTime start, LocalDateTime end);
}
