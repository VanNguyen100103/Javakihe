package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.Pet;
import com.ecommerce.pawfund.service.inter.ICloudinaryService;
import com.ecommerce.pawfund.service.inter.IPetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.repository.UserRepository;
import com.ecommerce.pawfund.dto.PetResponseDTO;
import com.ecommerce.pawfund.dto.ShelterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    @Autowired
    private IPetService petService;
    @Autowired
    private ICloudinaryService cloudinaryService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<PetResponseDTO>> getPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer age,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer ageMin,
            @RequestParam(required = false) Integer ageMax
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> pets = petService.findByFilterAndSearch(status, breed, search, age, location, ageMin, ageMax, pageable);
        Page<PetResponseDTO> dtoPage = pets.map(this::toPetResponseDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        Optional<Pet> pet = petService.findById(id);
        return pet.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<PetResponseDTO> createPet(
        @ModelAttribute Pet pet,
        @RequestPart(value = "images", required = false) List<MultipartFile> images,
        @RequestParam(value = "shelterId", required = false) Long shelterId,
        Authentication authentication) {
        // Chỉ cho phép shelter staff hoặc admin
        if (!hasRole(authentication, "SHELTER", "ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        if (images != null && !images.isEmpty()) {
            try {
                List<String> urls = cloudinaryService.uploadFiles(images);
                pet.setImageUrls(String.join(",", urls));
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }

        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && user.getRole() == User.Role.SHELTER) {
            pet.setShelter(user);
        } else if (user != null && user.getRole() == User.Role.ADMIN) {
            // Admin bắt buộc phải nhập shelterId
            if (shelterId == null) {
                return ResponseEntity.badRequest().body(null); // Hoặc trả về message lỗi tuỳ ý
            }
            User shelter = userRepository.findById(shelterId).orElse(null);
            if (shelter == null || shelter.getRole() != User.Role.SHELTER) {
                return ResponseEntity.badRequest().body(null); // shelterId không hợp lệ
            }
            pet.setShelter(shelter);
        }
        Pet saved = petService.save(pet);
        return ResponseEntity.ok(toPetResponseDTO(saved));
    }

    private PetResponseDTO toPetResponseDTO(Pet pet) {
        PetResponseDTO dto = new PetResponseDTO();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setImageUrls(pet.getImageUrls());
        dto.setDescription(pet.getDescription());
        dto.setAge(pet.getAge());
        dto.setBreed(pet.getBreed());
        dto.setLocation(pet.getLocation());
        dto.setStatus(pet.getStatus() != null ? pet.getStatus().name() : null); // Sửa dòng này
        dto.setShelter(toShelterDTO(pet.getShelter()));
        return dto;
    }

    private ShelterDTO toShelterDTO(User shelter) {
        if (shelter == null) return null;
        ShelterDTO dto = new ShelterDTO();
        dto.setUsername(shelter.getUsername());
        dto.setEmail(shelter.getEmail());
        dto.setFullName(shelter.getFullName());
        dto.setPhone(shelter.getPhone());
        dto.setAddress(shelter.getAddress());
        return dto;
    }

    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Pet> updatePet(@PathVariable Long id,
                                         @RequestPart("pet") Pet pet,
                                         @RequestPart(value = "images", required = false) List<MultipartFile> images,
                                         Authentication authentication) {
        if (!hasRole(authentication, "SHELTER", "ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        Optional<Pet> existing = petService.findById(id);
        if (existing.isPresent()) {
            pet.setId(id);
            if (images != null && !images.isEmpty()) {
                try {
                    List<String> urls = cloudinaryService.uploadFiles(images);
                    pet.setImageUrls(String.join(",", urls));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().build();
                }
            } else {
                pet.setImageUrls(existing.get().getImageUrls());
            }
            return ResponseEntity.ok(petService.save(pet));
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        if (petService.findById(id).isPresent()) {
            petService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private boolean hasRole(Authentication authentication, String... roles) {
        if (authentication == null || authentication.getAuthorities() == null) return false;
        for (String role : roles) {
            if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_" + role))) {
                return true;
            }
        }
        return false;
    }
} 