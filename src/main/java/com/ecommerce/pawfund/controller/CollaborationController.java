package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.CollaborationRequest;
import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.repository.CollaborationRequestRepository;
import com.ecommerce.pawfund.repository.EventRepository;
import com.ecommerce.pawfund.repository.UserRepository;
import com.ecommerce.pawfund.notification.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/collaborations")
public class CollaborationController {

    private final CollaborationRequestRepository collaborationRequestRepository;

    private final EventRepository eventRepository;

    private final UserRepository userRepository;

    private final NotificationService notificationService;

    public CollaborationController(CollaborationRequestRepository collaborationRequestRepository, EventRepository eventRepository, UserRepository userRepository, NotificationService notificationService) {
        this.collaborationRequestRepository = collaborationRequestRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @PreAuthorize("hasAnyRole('SHELTER', 'SHELTER_STAFF')")
    @PostMapping("/invite/{eventId}/{inviteeId}")
    public ResponseEntity<?> inviteShelter(
            @PathVariable Long eventId,
            @PathVariable Long inviteeId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        
        try {
            User requester = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Event event = eventOpt.get();

            // Check if requester is the main shelter
            if (!event.getMainShelter().getId().equals(requester.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only the main shelter can invite collaborators");
            }

            User invitee = userRepository.findById(inviteeId)
                    .orElseThrow(() -> new RuntimeException("Invitee not found"));

            // Check if invitee is a shelter
            if (invitee.getRole() != User.Role.SHELTER) {
                return ResponseEntity.badRequest()
                        .body("Invitee must be a shelter");
            }

            // Check if already a collaborator
            if (event.getCollaborators().contains(invitee)) {
                return ResponseEntity.badRequest()
                        .body("Shelter is already a collaborator");
            }

            // Check for existing pending request
            Optional<CollaborationRequest> existingRequest = collaborationRequestRepository
                    .findByEventAndInviteeAndStatus(event, invitee, CollaborationRequest.Status.PENDING);
            if (existingRequest.isPresent()) {
                return ResponseEntity.badRequest()
                        .body("A pending invitation already exists");
            }

            // Create collaboration request
            CollaborationRequest request = new CollaborationRequest();
            request.setEvent(event);
            request.setRequester(requester);
            request.setInvitee(invitee);
            request.setStatus(CollaborationRequest.Status.PENDING);
            request.setMessage(body != null ? body.get("message") : null);

            collaborationRequestRepository.save(request);

            // Send notification
            notificationService.notifyUser(
                invitee, 
                "New Collaboration Request", 
                "You have been invited to collaborate on event: " + event.getTitle()
            );

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating collaboration request: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SHELTER', 'SHELTER_STAFF')")
    @PutMapping("/{requestId}/respond")
    public ResponseEntity<?> respondToInvitation(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> response,
            Authentication authentication) {
        
        try {
            User responder = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<CollaborationRequest> requestOpt = collaborationRequestRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            CollaborationRequest request = requestOpt.get();

            // Verify the responder is the invitee
            if (!request.getInvitee().getId().equals(responder.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only the invited shelter can respond to this request");
            }

            // Check if request is still pending
            if (request.getStatus() != CollaborationRequest.Status.PENDING) {
                return ResponseEntity.badRequest()
                        .body("This request has already been " + request.getStatus().toString().toLowerCase());
            }

            String action = response.get("action");
            if (!"ACCEPT".equals(action) && !"REJECT".equals(action)) {
                return ResponseEntity.badRequest()
                        .body("Invalid action. Must be either ACCEPT or REJECT");
            }

            if ("ACCEPT".equals(action)) {
                request.setStatus(CollaborationRequest.Status.ACCEPTED);
                Event event = request.getEvent();
                event.getCollaborators().add(responder);
                eventRepository.save(event);
            } else {
                request.setStatus(CollaborationRequest.Status.REJECTED);
            }

            collaborationRequestRepository.save(request);

            // Notify the requester
            notificationService.notifyUser(
                request.getRequester(),
                "Collaboration Request " + action,
                "Your collaboration request for event '" + request.getEvent().getTitle() + 
                "' has been " + action + "ED by " + responder.getFullName()
            );

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error responding to collaboration request: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SHELTER', 'SHELTER_STAFF')")
    @GetMapping("/pending")
    public ResponseEntity<List<CollaborationRequest>> getPendingRequests(Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<CollaborationRequest> requests = collaborationRequestRepository
                    .findByInviteeAndStatus(user, CollaborationRequest.Status.PENDING);

            return ResponseEntity.ok(requests);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasAnyRole('SHELTER', 'SHELTER_STAFF')")
    @GetMapping("/sent")
    public ResponseEntity<List<CollaborationRequest>> getSentRequests(Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<CollaborationRequest> requests = collaborationRequestRepository
                    .findByRequesterAndStatus(user, CollaborationRequest.Status.PENDING);

            return ResponseEntity.ok(requests);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
