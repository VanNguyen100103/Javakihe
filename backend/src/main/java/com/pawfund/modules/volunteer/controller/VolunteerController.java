package com.pawfund.modules.volunteer.controller;

import com.pawfund.modules.common.dto.ApiResponse;
import com.pawfund.modules.common.enums.VolunteerStatus;
import com.pawfund.modules.volunteer.dto.VolunteerProfileDTO;
import com.pawfund.modules.volunteer.service.VolunteerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerController {
    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VolunteerProfileDTO>>> getAllVolunteers() {
        return ResponseEntity.ok(ApiResponse.success(volunteerService.getAllVolunteers()));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VolunteerProfileDTO>>> getVolunteersByStatus(
            @PathVariable VolunteerStatus status) {
        return ResponseEntity.ok(ApiResponse.success(volunteerService.getVolunteersByStatus(status)));
    }

    @GetMapping("/skill/{skill}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHELTER')")
    public ResponseEntity<ApiResponse<List<VolunteerProfileDTO>>> getVolunteersBySkill(
            @PathVariable String skill) {
        return ResponseEntity.ok(ApiResponse.success(volunteerService.getVolunteersBySkill(skill)));
    }

    @PostMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<VolunteerProfileDTO>> createVolunteerProfile(
            @PathVariable Long userId,
            @Valid @RequestBody VolunteerProfileDTO profileDTO) {
        return ResponseEntity.ok(ApiResponse.success(volunteerService.createVolunteerProfile(userId, profileDTO)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VolunteerProfileDTO>> updateVolunteerStatus(
            @PathVariable Long id,
            @RequestBody UpdateVolunteerStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            volunteerService.updateVolunteerStatus(id, request.getStatus())
        ));
    }

    @PutMapping("/{id}/hours")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHELTER')")
    public ResponseEntity<ApiResponse<VolunteerProfileDTO>> updateVolunteerHours(
            @PathVariable Long id,
            @RequestBody UpdateVolunteerHoursRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            volunteerService.updateVolunteerHours(id, request.getHours())
        ));
    }
}

record UpdateVolunteerStatusRequest(VolunteerStatus status) { 
    public VolunteerStatus getStatus() { return status; }
}

record UpdateVolunteerHoursRequest(Integer hours) { 
    public Integer getHours() { return hours; }
}
