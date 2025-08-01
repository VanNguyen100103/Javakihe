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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;

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
            @RequestParam(required = false) Integer ageMax,
            @RequestParam(required = false) String gender
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pet> pets = petService.findByFilterAndSearch(status, breed, search, age, location, ageMin, ageMax, gender, pageable);
        Page<PetResponseDTO> dtoPage = pets.map(this::toPetResponseDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        Optional<Pet> pet = petService.findById(id);
        return pet.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint để thêm ảnh cho pet
    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    @PostMapping(value="/{petId}/add-images")
    public ResponseEntity<Map<String, Object>> addImagesToPet(
            @PathVariable Long petId,
            @RequestParam("images") List<MultipartFile> images,
            Authentication authentication) {
        
        try {
            System.out.println("=== ADD IMAGES TO PET " + petId + " ===");
            System.out.println("Received " + images.size() + " images");
            
            // Kiểm tra pet có tồn tại không
            Optional<Pet> petOptional = petService.findById(petId);
            if (!petOptional.isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Pet not found with ID: " + petId);
                return ResponseEntity.notFound().build();
            }
            
            Pet pet = petOptional.get();
            
            // Kiểm tra quyền (chỉ shelter sở hữu pet hoặc admin mới được upload)
            if (!hasRole(authentication, "ADMIN")) {
                String username = authentication.getName();
                User user = userRepository.findByUsername(username).orElse(null);
                if (user == null || user.getRole() != User.Role.SHELTER || 
                    !pet.getShelter().getId().equals(user.getId())) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Unauthorized to add images for this pet");
                    return ResponseEntity.status(403).body(errorResponse);
                }
            }
            
            List<String> uploadedUrls = new ArrayList<>();
            List<String> errors = new ArrayList<>();
            
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);
                System.out.println("Processing image " + (i+1) + ": " + file.getOriginalFilename() + 
                                " (size: " + file.getSize() + " bytes, type: " + file.getContentType() + ")");
                
                // Validate file type
                if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                    String error = "File " + file.getOriginalFilename() + " is not an image";
                    System.out.println("ERROR: " + error);
                    errors.add(error);
                    continue;
                }
                
                // Validate file size (max 10MB)
                if (file.getSize() > 10 * 1024 * 1024) {
                    String error = "File " + file.getOriginalFilename() + " is too large (max 10MB)";
                    System.out.println("ERROR: " + error);
                    errors.add(error);
                    continue;
                }
                
                try {
                    String url = cloudinaryService.uploadFile(file);
                    uploadedUrls.add(url);
                    System.out.println("Successfully uploaded image " + (i+1) + " to: " + url);
                } catch (Exception e) {
                    String error = "Failed to upload " + file.getOriginalFilename() + ": " + e.getMessage();
                    System.out.println("ERROR: " + error);
                    errors.add(error);
                }
            }
            
            // Thêm ảnh mới vào imageUrls hiện tại
            if (!uploadedUrls.isEmpty()) {
                String currentUrls = pet.getImageUrls();
                String newUrls = String.join(",", uploadedUrls);
                
                if (currentUrls != null && !currentUrls.isEmpty()) {
                    pet.setImageUrls(currentUrls + "," + newUrls);
                } else {
                    pet.setImageUrls(newUrls);
                }
                
                petService.save(pet);
                System.out.println("Updated pet " + petId + " with " + uploadedUrls.size() + " new images");
            }
            
            // Đếm số ảnh hiện tại trong pet
            int currentImageCount = 0;
            if (pet.getImageUrls() != null && !pet.getImageUrls().isEmpty()) {
                currentImageCount = pet.getImageUrls().split(",").length;
            }
            
            // Tính tổng số ảnh sau khi upload
            int totalImageCount = currentImageCount + uploadedUrls.size();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("petId", petId);
            response.put("uploadedCount", uploadedUrls.size());
            response.put("totalCount", totalImageCount);
            response.put("urls", uploadedUrls);
            response.put("errors", errors);
            response.put("message", "Successfully added " + uploadedUrls.size() + " images to pet " + petId + ". Total images: " + totalImageCount);
            
            System.out.println("Add images completed: " + uploadedUrls.size() + " successful, " + errors.size() + " failed");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("ERROR in add images to pet: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Add images failed: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    @DeleteMapping(value="/{petId}/remove-images")
    public ResponseEntity<Map<String, Object>> removeImagesFromPet(
            @PathVariable Long petId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        
        try {
            System.out.println("=== REMOVE IMAGES FROM PET ===");
            System.out.println("Pet ID: " + petId);
            
            // Tìm pet
            Pet pet = petService.findById(petId).orElse(null);
            if (pet == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Pet not found with ID: " + petId);
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            // Kiểm tra quyền - chỉ shelter owner hoặc admin mới được xóa
            String currentUsername = authentication.getName();
            User currentUser = userRepository.findByUsername(currentUsername).orElse(null);
            
            if (currentUser == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "User not found");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            // Admin có thể xóa ảnh của bất kỳ pet nào
            if (!hasRole(authentication, "ADMIN")) {
                // Shelter staff chỉ có thể xóa ảnh của pet thuộc về shelter của họ
                if (pet.getShelter() == null || !pet.getShelter().getId().equals(currentUser.getId())) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "You don't have permission to remove images from this pet");
                    return ResponseEntity.status(403).body(errorResponse);
                }
            }
            
            // Lấy danh sách URL cần xóa
            @SuppressWarnings("unchecked")
            List<String> urlsToRemove = (List<String>) request.get("urls");
            
            if (urlsToRemove == null || urlsToRemove.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "No URLs provided to remove");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            // Lấy danh sách URL hiện tại
            String currentImageUrls = pet.getImageUrls();
            if (currentImageUrls == null || currentImageUrls.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Pet has no images to remove");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            List<String> currentUrls = Arrays.asList(currentImageUrls.split(","));
            List<String> remainingUrls = new ArrayList<>();
            List<String> removedUrls = new ArrayList<>();
            
            // Lọc ra các URL cần giữ lại
            for (String url : currentUrls) {
                String trimmedUrl = url.trim();
                if (!urlsToRemove.contains(trimmedUrl)) {
                    remainingUrls.add(trimmedUrl);
                } else {
                    removedUrls.add(trimmedUrl);
                }
            }
            
            // Cập nhật imageUrls TRƯỚC
            if (remainingUrls.isEmpty()) {
                pet.setImageUrls(null);
            } else {
                pet.setImageUrls(String.join(",", remainingUrls));
            }
            
            // Lưu vào database
            petService.save(pet);
            System.out.println("Database updated successfully");
            
            // Bỏ qua việc xóa từ Cloudinary vì không hoạt động
            System.out.println("Skipping Cloudinary deletion for URLs: " + removedUrls);
            
            // Đếm số ảnh còn lại
            int remainingCount = remainingUrls.size();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("petId", petId);
            response.put("removedCount", removedUrls.size());
            response.put("remainingCount", remainingCount);
            response.put("removedUrls", removedUrls);
            response.put("message", "Successfully removed " + removedUrls.size() + " images from pet " + petId + ". Remaining images: " + remainingCount);
            
            System.out.println("Remove images completed: " + removedUrls.size() + " removed, " + remainingCount + " remaining");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("ERROR in remove images from pet: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Remove images failed: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }



    

    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<PetResponseDTO> createPet(
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("age") Integer age,
        @RequestParam("breed") String breed,
        @RequestParam("location") String location,
        @RequestParam("status") String status,
        @RequestParam("gender") String gender,
        @RequestParam(value = "vaccinated", required = false) String vaccinated,
        @RequestParam(value = "dewormed", required = false) String dewormed,
        @RequestParam(value = "images", required = false) List<MultipartFile> images,
        @RequestParam(value = "shelterId", required = false) Long shelterId,
        Authentication authentication,
        HttpServletRequest request) {

        try {
            System.out.println("=== CREATE PET ===");
            System.out.println("Content-Type: " + request.getContentType());
            System.out.println("Content-Length: " + request.getContentLength());
            
            Pet pet = new Pet();
            pet.setName(name);
            pet.setDescription(description);
            pet.setAge(age);
            pet.setBreed(breed);
            pet.setLocation(location);
            pet.setStatus(Pet.Status.valueOf(status));
            pet.setGender(Pet.Gender.valueOf(gender));
            
            // Set vaccinated status
            if (vaccinated != null && !vaccinated.isEmpty()) {
                pet.setVaccinated(Boolean.parseBoolean(vaccinated));
            } else {
                pet.setVaccinated(false); // Default value
            }
            
            // Set dewormed status
            if (dewormed != null && !dewormed.isEmpty()) {
                pet.setDewormed(Boolean.parseBoolean(dewormed));
            } else {
                pet.setDewormed(false); // Default value
            }
            
            System.out.println("Pet data: " + pet);
            System.out.println("Images count: " + (images != null ? images.size() : 0));
            System.out.println("ShelterId: " + shelterId);
        
        // Chỉ cho phép shelter staff hoặc admin
        if (!hasRole(authentication, "SHELTER", "ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        
        if (images != null && !images.isEmpty()) {
            try {
                System.out.println("Uploading " + images.size() + " images...");
                List<String> urls = cloudinaryService.uploadFiles(images);
                pet.setImageUrls(String.join(",", urls));
                System.out.println("Uploaded images: " + urls);
            } catch (Exception e) {
                System.out.println("Error uploading images: " + e.getMessage());
                e.printStackTrace();
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
            System.out.println("Pet saved with ID: " + saved.getId());
            return ResponseEntity.ok(toPetResponseDTO(saved));
            
        } catch (Exception e) {
            System.err.println("ERROR in createPet: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
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
        dto.setStatus(pet.getStatus() != null ? pet.getStatus().name() : null);
        dto.setGender(pet.getGender() != null ? pet.getGender().name() : null);
        dto.setVaccinated(pet.getVaccinated());
        dto.setDewormed(pet.getDewormed());
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
                                         @RequestParam(value = "shelterId", required = false) Long shelterId,
                                         Authentication authentication) {
        if (!hasRole(authentication, "SHELTER", "ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        Optional<Pet> existing = petService.findById(id);
        if (existing.isPresent()) {
            Pet existingPet = existing.get();
            pet.setId(id);
            
            // Handle shelter assignment for admin
            User user = userRepository.findByUsername(authentication.getName()).orElse(null);
            if (user != null && user.getRole() == User.Role.SHELTER) {
                // Shelter can only assign to themselves
                pet.setShelter(user);
            } else if (user != null && user.getRole() == User.Role.ADMIN) {
                // Admin can assign to any shelter or remove assignment
                if (shelterId != null) {
                    User shelter = userRepository.findById(shelterId).orElse(null);
                    if (shelter != null && shelter.getRole() == User.Role.SHELTER) {
                        pet.setShelter(shelter);
                    }
                } else {
                    // Remove shelter assignment
                    pet.setShelter(null);
                }
            } else {
                // Preserve existing shelter
                pet.setShelter(existingPet.getShelter());
            }
            
            if (images != null && !images.isEmpty()) {
                try {
                    List<String> urls = cloudinaryService.uploadFiles(images);
                    pet.setImageUrls(String.join(",", urls));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().build();
                }
            } else {
                pet.setImageUrls(existingPet.getImageUrls());
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