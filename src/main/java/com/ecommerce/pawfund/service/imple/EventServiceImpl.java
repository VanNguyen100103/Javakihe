package com.ecommerce.pawfund.service.imple;

import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.dto.EventDTO;
import com.ecommerce.pawfund.repository.EventRepository;
import com.ecommerce.pawfund.service.inter.IEventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements IEventService {
    @Autowired
    private EventRepository eventRepository;

    @Override
    public Optional<Event> findById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    @Override
    public Event save(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    @Override
    public List<Event> findByShelterId(Long shelterId) {
        return eventRepository.findByShelterId(shelterId);
    }

    @Override
    public List<EventDTO> findAllAsDTO() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EventDTO> findByIdAsDTO(Long id) {
        return eventRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<EventDTO> findByShelterIdAsDTO(Long shelterId) {
        return eventRepository.findByShelterId(shelterId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setDate(event.getDate());
        dto.setLocation(event.getLocation());
        dto.setCategory(event.getCategory().name());
        dto.setStatus(event.getStatus().name());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setMaxParticipants(event.getMaxParticipants());

        // Convert multiple shelters
        if (event.getShelters() != null && !event.getShelters().isEmpty()) {
            List<Long> shelterIds = event.getShelters().stream()
                .map(User::getId)
                .collect(Collectors.toList());
            List<String> shelterNames = event.getShelters().stream()
                .map(User::getUsername)
                .collect(Collectors.toList());
            dto.setShelterIds(shelterIds);
            dto.setShelterNames(shelterNames);
        }

        // Convert multiple volunteers
        if (event.getVolunteers() != null && !event.getVolunteers().isEmpty()) {
            List<Long> volunteerIds = event.getVolunteers().stream()
                .map(User::getId)
                .collect(Collectors.toList());
            List<String> volunteerNames = event.getVolunteers().stream()
                .map(User::getUsername)
                .collect(Collectors.toList());
            dto.setVolunteerIds(volunteerIds);
            dto.setVolunteerNames(volunteerNames);
        }

        // Convert multiple donors
        if (event.getDonors() != null && !event.getDonors().isEmpty()) {
            List<Long> donorIds = event.getDonors().stream()
                .map(User::getId)
                .collect(Collectors.toList());
            List<String> donorNames = event.getDonors().stream()
                .map(User::getUsername)
                .collect(Collectors.toList());
            dto.setDonorIds(donorIds);
            dto.setDonorNames(donorNames);
        }

        return dto;
    }

    @Override
    public EventDTO saveAsDTO(Event event) {
        Event savedEvent = save(event);
        return convertToDTO(savedEvent);
    }
} 