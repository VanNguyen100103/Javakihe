package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.dto.EventDTO;
import com.ecommerce.pawfund.service.inter.IEventService;
import com.ecommerce.pawfund.service.inter.ICloudinaryService;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.repository.UserRepository;
import com.ecommerce.pawfund.notification.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;
import org.springframework.security.access.prepost.PreAuthorize;
import java.time.LocalDateTime;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private IEventService eventService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ICloudinaryService cloudinaryService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents(
            @RequestParam(required = false) Long shelterId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        
        List<EventDTO> events;
        if (shelterId != null) {
            events = eventService.findByShelterIdAsDTO(shelterId);
        } else {
            events = eventService.findAllAsDTO();
        }
        
        // Apply filters
        if (category != null && !category.isEmpty()) {
            events = events.stream()
                .filter(event -> event.getCategory() != null && 
                               event.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
        }
        
        if (status != null && !status.isEmpty()) {
            events = events.stream()
                .filter(event -> event.getStatus() != null && 
                               event.getStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
        }
        
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            events = events.stream()
                .filter(event -> 
                    (event.getTitle() != null && event.getTitle().toLowerCase().contains(searchLower)) ||
                    (event.getDescription() != null && event.getDescription().toLowerCase().contains(searchLower)) ||
                    (event.getLocation() != null && event.getLocation().toLowerCase().contains(searchLower)))
                .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        Optional<EventDTO> event = eventService.findByIdAsDTO(id);
        return event.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

  
    // Get shelters for event form (ADMIN only)
    @GetMapping("/shelters")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getSheltersForEvent() {
        List<User> shelterUsers = userRepository.findByRole(User.Role.SHELTER);
        List<Map<String, Object>> shelters = shelterUsers.stream()
            .map(user -> {
                Map<String, Object> shelter = new HashMap<>();
                shelter.put("id", user.getId());
                shelter.put("name", user.getFullName());
                shelter.put("username", user.getUsername());
                return shelter;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(shelters);
    }

    // Get volunteers for event form (ADMIN only)
    @GetMapping("/volunteers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getVolunteersForEvent() {
        List<User> volunteerUsers = userRepository.findByRole(User.Role.VOLUNTEER);
        List<Map<String, Object>> volunteers = volunteerUsers.stream()
            .map(user -> {
                Map<String, Object> volunteer = new HashMap<>();
                volunteer.put("id", user.getId());
                volunteer.put("name", user.getFullName());
                volunteer.put("username", user.getUsername());
                return volunteer;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(volunteers);
    }

    // Get donors for event form (ADMIN only)
    @GetMapping("/donors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getDonorsForEvent() {
        List<User> donorUsers = userRepository.findByRole(User.Role.DONOR);
        List<Map<String, Object>> donors = donorUsers.stream()
            .map(user -> {
                Map<String, Object> donor = new HashMap<>();
                donor.put("id", user.getId());
                donor.put("name", user.getFullName());
                donor.put("username", user.getUsername());
                return donor;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(donors);
    }



    @PreAuthorize("hasRole('SHELTER')")
    @PostMapping(consumes = {"application/json"})
    public ResponseEntity<?> createEvent(@RequestBody Event event, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Set current user as main shelter
            event.setMainShelter(user);
            
            // Initialize empty lists
            event.setCollaborators(new ArrayList<>());
            event.setVolunteers(new ArrayList<>());
            event.setDonors(new ArrayList<>());

            // Set default values if not provided
            if (event.getTitle() == null || event.getTitle().trim().isEmpty()) {
                event.setTitle("New Event");
            }
            if (event.getDescription() == null || event.getDescription().trim().isEmpty()) {
                event.setDescription("Event Description");
            }
            if (event.getLocation() == null || event.getLocation().trim().isEmpty()) {
                event.setLocation("Event Location");
            }
            if (event.getDate() == null) {
                event.setDate(LocalDateTime.now().plusDays(1));
            }
            if (event.getCategory() == null) {
                event.setCategory(Event.Category.ADOPTION);
            }
            if (event.getStatus() == null) {
                event.setStatus(Event.Status.UPCOMING);
            }
            if (event.getStartTime() == null || event.getStartTime().trim().isEmpty()) {
                event.setStartTime("09:00");
            }
            if (event.getEndTime() == null || event.getEndTime().trim().isEmpty()) {
                event.setEndTime("17:00");
            }
            if (event.getMaxParticipants() == null) {
                event.setMaxParticipants(100);
            }

            EventDTO savedEvent = eventService.saveAsDTO(event);
            
            // Send notification to main shelter
            notificationService.notifyUser(
                user,
                "Event Created",
                "You have successfully created a new event: " + event.getTitle()
            );
            
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating event: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SHELTER','VOLUNTEER','ADMIN')")
    @PutMapping(value = "/{id}", consumes = {"application/json"})
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        Optional<EventDTO> existingOpt = eventService.findByIdAsDTO(id);
        if (!existingOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        EventDTO existing = existingOpt.get();
        
        // Set ID for the event to update
        event.setId(id);
        
        // Preserve existing relationships if not provided
        if (((Event) event).getShelters() == null || event.getShelters().isEmpty()) {
            // Keep existing shelters - this would need to be handled in service layer
        }
        
        if (event.getVolunteers() == null || event.getVolunteers().isEmpty()) {
            // Keep existing volunteers - this would need to be handled in service layer
        }
        
        EventDTO updatedEvent = eventService.saveAsDTO(event);
        return ResponseEntity.ok(updatedEvent);
    }

    @PreAuthorize("hasAnyRole('SHELTER','VOLUNTEER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventService.findByIdAsDTO(id).isPresent()) {
            eventService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get events for current shelter user
    @GetMapping("/shelter-events")
    @PreAuthorize("hasRole('SHELTER')")
    public ResponseEntity<List<EventDTO>> getShelterEvents(Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username).orElse(null);
            
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            List<EventDTO> shelterEvents = eventService.findByShelterIdAsDTO(currentUser.getId());
            return ResponseEntity.ok(shelterEvents);
        } catch (Exception e) {
            System.err.println("Error getting shelter events: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get events for current volunteer user
    @GetMapping("/volunteer-events")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<List<EventDTO>> getVolunteerEvents(Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userRepository.findByUsername(username).orElse(null);
            
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            List<EventDTO> volunteerEvents = eventService.findByVolunteerIdAsDTO(currentUser.getId());
            return ResponseEntity.ok(volunteerEvents);
        } catch (Exception e) {
            System.err.println("Error getting volunteer events: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 