package com.ecommerce.pawfund.service.inter;

import com.ecommerce.pawfund.entity.Event;
import java.util.List;
import java.util.Optional;

public interface IEventService {
    Optional<Event> findById(Long id);
    List<Event> findAll();
    Event save(Event event);
    void deleteById(Long id);
    List<Event> findByShelterId(Long shelterId);
} 