package com.pawfund.modules.shelter.controller;

import com.pawfund.modules.common.dto.ApiResponse;
import com.pawfund.modules.shelter.dto.ShelterProfileDTO;
import com.pawfund.modules.shelter.service.ShelterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelters")
@CrossOrigin(origins = "http://localhost:3000")
public class ShelterController {
    private final ShelterService shelterService;

    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShelterProfileDTO>>> getAllShelters() {
        return ResponseEntity.ok(ApiResponse.success(shelterService.getAllShelters()));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<ShelterProfileDTO>>> getSheltersWithAvailableCapacity() {
        return ResponseEntity.ok(ApiResponse.success(shelterService.getSheltersWithAvailableCapacity()));
    }

    @PostMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShelterProfileDTO>> createShelterProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ShelterProfileDTO profileDTO) {
        return ResponseEntity.ok(ApiResponse.success(
            shelterService.createShelterProfile(userId, profileDTO)
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isShelterOwner(#id)")
    public ResponseEntity<ApiResponse<ShelterProfileDTO>> updateShelterProfile(
            @PathVariable Long id,
            @Valid @RequestBody ShelterProfileDTO profileDTO) {
        return ResponseEntity.ok(ApiResponse.success(
            shelterService.updateShelterProfile(id, profileDTO)
        ));
    }
}
