package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByShelterId(Long shelterId);
} 