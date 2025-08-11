package com.ecommerce.pawfund.service.inter;

import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.dto.EventDTO;
import java.util.List;
import java.util.Optional;

public interface IEventService {
    Optional<Event> findById(Long id);
    List<Event> findAll();
    Event save(Event event);
    void deleteById(Long id);
    List<Event> findByShelterId(Long shelterId);
    
    // New methods for DTO
    List<EventDTO> findAllAsDTO();
    Optional<EventDTO> findByIdAsDTO(Long id);
    List<EventDTO> findByShelterIdAsDTO(Long shelterId);
    List<EventDTO> findByVolunteerIdAsDTO(Long volunteerId);
    EventDTO convertToDTO(Event event);
    EventDTO saveAsDTO(Event event);
} 