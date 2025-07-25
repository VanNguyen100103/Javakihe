package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.service.inter.IEventService;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import org.springframework.security.access.prepost.PreAuthorize;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private IEventService eventService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Event> getAllEvents(@RequestParam(required = false) Long shelterId) {
        if (shelterId != null) return eventService.findByShelterId(shelterId);
        return eventService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.findById(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('SHELTER','VOLUNTEER','ADMIN')")
    @PostMapping(consumes = {"application/x-www-form-urlencoded", "application/json"})
    public Event createEvent(
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam String date,
        @RequestParam String location,
        @RequestParam(required = false) Long shelterId
    ) {
        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setLocation(location);
        event.setDate(LocalDateTime.parse(date));
        User shelter = null;
        if (shelterId != null) {
            shelter = userRepository.findById(shelterId).orElse(null);
        }
        event.setShelter(shelter);
        return eventService.save(event);
    }

    @PreAuthorize("hasAnyRole('SHELTER','VOLUNTEER','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        Optional<Event> existing = eventService.findById(id);
        if (existing.isPresent()) {
            event.setId(id);
            return ResponseEntity.ok(eventService.save(event));
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAnyRole('SHELTER','VOLUNTEER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventService.findById(id).isPresent()) {
            eventService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
} 