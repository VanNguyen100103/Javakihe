package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.Adoption;
import com.ecommerce.pawfund.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import com.ecommerce.pawfund.dto.AdoptionRequestDTO;
import com.ecommerce.pawfund.entity.Pet;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.service.inter.IAdoptionService;
import com.ecommerce.pawfund.service.inter.IPetService;
import com.ecommerce.pawfund.service.inter.IUserService;
import com.ecommerce.pawfund.entity.AdoptionTestResult;
import com.ecommerce.pawfund.repository.AdoptionTestResultRepository;
import com.ecommerce.pawfund.entity.UserCart;
import com.ecommerce.pawfund.repository.UserCartRepository;
import java.util.Map;
import java.util.HashMap;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/adoptions")
public class AdoptionController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private IPetService petService;
    @Autowired
    private IUserService userService;

    @Autowired
    private IAdoptionService adoptionService;

    @Autowired
    private AdoptionTestResultRepository adoptionTestResultRepository;

    @Autowired
    private UserCartRepository userCartRepository;

    @GetMapping
    public List<Adoption> getAllApplications(@RequestParam(required = false) Long userId,
                                                       @RequestParam(required = false) Long petId,
                                                       Authentication authentication) {
        System.out.println("=== getAllApplications called ===");
        System.out.println("userId: " + userId);
        System.out.println("petId: " + petId);
        System.out.println("authentication: " + (authentication != null ? "not null" : "null"));
        
        // Nếu có userId parameter, trả về adoptions của user đó (cho admin/shelter)
        if (userId != null) {
            System.out.println("Returning adoptions for userId: " + userId);
            return adoptionService.findByUserId(userId);
        }
        if (petId != null) {
            System.out.println("Returning adoptions for petId: " + petId);
            return adoptionService.findByPetId(petId);
        }
        
        // Nếu không có parameter, trả về adoptions của user hiện tại
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            System.out.println("Current user username: " + username);
            User currentUser = userService.findByUsername(username).orElse(null);
            System.out.println("Current user found: " + (currentUser != null ? "yes" : "no"));
            if (currentUser != null) {
                System.out.println("Current user ID: " + currentUser.getId());
                List<Adoption> userAdoptions = adoptionService.findByUserId(currentUser.getId());
                System.out.println("Found " + userAdoptions.size() + " adoptions for current user");
                return userAdoptions;
            }
        }
        
        System.out.println("Returning empty list");
        return new ArrayList<>();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adoption> getApplicationById(@PathVariable Long id) {
        Optional<Adoption> app = adoptionService.findById(id);
        return app.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADOPTER')")
    @PostMapping(consumes = {"application/x-www-form-urlencoded", "application/json"})
    public Adoption createApplication(@ModelAttribute AdoptionRequestDTO dto, Authentication authentication) {
        // Lấy user từ token đăng nhập
        String username = authentication.getName();
        User user = userService.findByUsername(username).orElse(null);
        Pet pet = petService.findById(dto.getPetId()).orElse(null);
        System.out.println("Pet found: " + pet);
        // Lấy điểm bài test gần nhất của user
        int score = 0;
        if (user != null) {
            AdoptionTestResult testResult = adoptionTestResultRepository.findTopByUserOrderByCreatedAtDesc(user).orElse(null);
            if (testResult != null) {
                score = testResult.getScore();
            }
        }
        Adoption app = new Adoption();
        app.setUser(user);
        app.setPet(pet);
        app.setMessage(dto.getMessage());
        // Removed phone and address - can be retrieved from user object
        app.setAppliedAt(LocalDateTime.now()); // Set application timestamp
        // Duyệt tự động dựa trên điểm
        if (score >= 70) {
            app.setStatus(Adoption.Status.APPROVED);
        } else {
            app.setStatus(Adoption.Status.REJECTED);
        }
        Adoption saved = adoptionService.save(app);
        // Gửi email xác nhận cho adopter
        if (saved.getUser() != null && saved.getUser().getEmail() != null) {
            String subject = "Đơn xin nhận nuôi đã được gửi";
            String text = "Đơn xin nhận nuôi của bạn cho thú cưng: " + (saved.getPet() != null ? saved.getPet().getName() : "") +
                    " đã được gửi thành công và đang chờ xét duyệt. Điểm bài test của bạn: " + score + ".";
            notificationService.sendEmail(saved.getUser().getEmail(), subject, text);
        }
        // Gửi email thông báo cho shelter staff
        if (saved.getPet() != null && saved.getPet().getShelter() != null && saved.getPet().getShelter().getEmail() != null) {
            notificationService.sendEmail(
                saved.getPet().getShelter().getEmail(),
                "Có đơn xin nhận nuôi mới cần xét duyệt",
                "Có một đơn xin nhận nuôi mới cho thú cưng: " + saved.getPet().getName() + ". Vui lòng đăng nhập để xét duyệt."
            );
        }
        return saved;
    }

    @PreAuthorize("hasRole('ADOPTER')")
    @PostMapping("/from-cart")
    public ResponseEntity<?> adoptFromCart(@ModelAttribute AdoptionRequestDTO dto, Authentication authentication) {
        try {
            System.out.println("=== adoptFromCart called ===");
            System.out.println("DTO: " + dto);
            
            String username = authentication.getName();
            User user = userService.findByUsername(username).orElse(null);
            System.out.println("User found: " + (user != null ? user.getUsername() : "null"));
            
            if (user == null) {
                return ResponseEntity.status(401).body("User not found");
            }
            
            UserCart userCart = userCartRepository.findByUserId(user.getId()).orElse(null);
            System.out.println("UserCart found: " + (userCart != null ? userCart.getPetIds().size() + " pets" : "null"));
            
            if (userCart == null || userCart.getPetIds().isEmpty()) {
                return ResponseEntity.badRequest().body("Cart is empty");
            }
            
            int score = 0;
            AdoptionTestResult testResult = adoptionTestResultRepository.findTopByUserOrderByCreatedAtDesc(user).orElse(null);
            if (testResult != null) {
                score = testResult.getScore();
                System.out.println("Test score: " + score);
            }
            
            List<Adoption> createdAdoptions = new java.util.ArrayList<>();
            StringBuilder summary = new StringBuilder();
            summary.append("Bạn đã gửi đơn xin nhận nuôi cho các thú cưng sau:\n");
            
            for (Long petId : userCart.getPetIds()) {
                Pet pet = petService.findById(petId).orElse(null);
                if (pet == null) continue;
                
                System.out.println("Creating adoption for pet: " + pet.getName() + " (ID: " + petId + ")");
                System.out.println("DTO message: " + dto.getMessage());
                
                Adoption app = new Adoption();
                app.setUser(user);
                app.setPet(pet);
                app.setMessage(dto.getMessage());
                // Removed phone and address - can be retrieved from user object
                app.setAppliedAt(LocalDateTime.now()); // Set application timestamp
                
                // Set status as PENDING for admin/shelter to review
                app.setStatus(Adoption.Status.PENDING);
                
                // Store test score in admin notes for reference
                String adminNotes = "Điểm bài test: " + score + "/100";
                if (score >= 70) {
                    adminNotes += " (Đủ điều kiện)";
                } else {
                    adminNotes += " (Cần cải thiện)";
                }
                app.setAdminNotes(adminNotes);
                
                Adoption saved = adoptionService.save(app);
                System.out.println("Adoption saved with ID: " + saved.getId() + ", Status: " + saved.getStatus());
                
                createdAdoptions.add(saved);
                summary.append("- ")
                    .append(pet.getName())
                    .append(": ĐÃ GỬI (Chờ xét duyệt)")
                    .append("\n");
                    
                // Gửi email cho shelter staff từng pet như cũ
                if (saved.getPet() != null && saved.getPet().getShelter() != null && saved.getPet().getShelter().getEmail() != null) {
                    notificationService.sendEmail(
                        saved.getPet().getShelter().getEmail(),
                        "Có đơn xin nhận nuôi mới cần xét duyệt",
                        "Có một đơn xin nhận nuôi mới cho thú cưng: " + saved.getPet().getName() + ". Vui lòng đăng nhập để xét duyệt."
                    );
                }
            }
            
            summary.append("\nĐiểm bài test của bạn: ").append(score).append(".");
            summary.append("\n\nCác đơn đã được gửi thành công và đang chờ xét duyệt bởi admin/shelter.");
            
            // Gửi 1 email tổng hợp cho user
            if (user.getEmail() != null) {
                notificationService.sendEmail(
                    user.getEmail(),
                    "Đơn xin nhận nuôi đã được gửi",
                    summary.toString()
                );
            }
            
            System.out.println("=== Total adoptions created: " + createdAdoptions.size() + " ===");
            
            // Clear cart after successful adoption
            if (userCart != null) {
                userCart.getPetIds().clear();
                userCartRepository.save(userCart);
                System.out.println("=== Cart cleared after adoption ===");
            }
            
            return ResponseEntity.ok(createdAdoptions);
            
        } catch (Exception e) {
            System.err.println("=== Error in adoptFromCart: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating adoptions: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Adoption> updateApplication(@PathVariable Long id, @RequestBody Adoption app) {
        Optional<Adoption> existing = adoptionService.findById(id);
        if (existing.isPresent()) {
            app.setId(id);
            Adoption updated = adoptionService.save(app);
            // Nếu trạng thái thay đổi và có user, gửi email kết quả
            if (updated.getUser() != null && updated.getUser().getEmail() != null && updated.getStatus() != null) {
                String subject = "Kết quả đơn xin nhận nuôi";
                String text = "Đơn xin nhận nuôi của bạn cho thú cưng: " + (updated.getPet() != null ? updated.getPet().getName() : "") +
                        " đã được " + (updated.getStatus() == Adoption.Status.APPROVED ? "DUYỆT" : updated.getStatus() == Adoption.Status.REJECTED ? "TỪ CHỐI" : "CẬP NHẬT");
                notificationService.sendEmail(updated.getUser().getEmail(), subject, text);
            }
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAnyRole('SHELTER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (adoptionService.findById(id).isPresent()) {
            adoptionService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get adoption statistics - Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdoptionStats() {
        try {
            List<Adoption> allAdoptions = adoptionService.findAll();
            
            // Calculate statistics
            long totalAdoptions = allAdoptions.size();
            long pendingAdoptions = allAdoptions.stream()
                .filter(adoption -> Adoption.Status.PENDING.equals(adoption.getStatus()))
                .count();
            long approvedAdoptions = allAdoptions.stream()
                .filter(adoption -> Adoption.Status.APPROVED.equals(adoption.getStatus()))
                .count();
            long rejectedAdoptions = allAdoptions.stream()
                .filter(adoption -> Adoption.Status.REJECTED.equals(adoption.getStatus()))
                .count();
            
            // Calculate this month's adoptions
            java.time.LocalDateTime startOfMonth = java.time.LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
            
            long thisMonthAdoptions = allAdoptions.stream()
                .filter(adoption -> adoption.getAppliedAt() != null && 
                        adoption.getAppliedAt().isAfter(startOfMonth))
                .count();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalAdoptions", totalAdoptions);
            stats.put("pendingAdoptions", pendingAdoptions);
            stats.put("approvedAdoptions", approvedAdoptions);
            stats.put("rejectedAdoptions", rejectedAdoptions);
            stats.put("thisMonthAdoptions", thisMonthAdoptions);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get adoption statistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get all adoptions (for admin/shelter)
    @PreAuthorize("hasAnyRole('ADMIN', 'SHELTER')")
    @GetMapping("/all")
    public ResponseEntity<List<Adoption>> getAllAdoptions() {
        try {
            System.out.println("=== getAllAdoptions called ===");
            List<Adoption> adoptions = adoptionService.getAllAdoptions();
            System.out.println("=== Found " + adoptions.size() + " adoptions ===");
            
            if (adoptions.isEmpty()) {
                System.out.println("=== No adoptions found in database ===");
            } else {
                System.out.println("=== First adoption: " + adoptions.get(0).getId() + " ===");
            }
            
            return ResponseEntity.ok(adoptions);
        } catch (Exception e) {
            System.err.println("=== Error in getAllAdoptions: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update adoption status (for admin/shelter)
    @PreAuthorize("hasAnyRole('ADMIN', 'SHELTER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<Adoption> updateAdoptionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== updateAdoptionStatus called ===");
            System.out.println("id: " + id);
            System.out.println("request: " + request);
            
            String status = (String) request.get("status");
            String adminNotes = (String) request.get("adminNotes");
            String shelterNotes = (String) request.get("shelterNotes");
            
            System.out.println("status: " + status);
            System.out.println("adminNotes: " + adminNotes);
            System.out.println("shelterNotes: " + shelterNotes);
            
            Adoption updatedAdoption = adoptionService.updateAdoptionStatus(id, status, adminNotes, shelterNotes);
            System.out.println("=== Updated adoption: " + updatedAdoption.getId() + " with status: " + updatedAdoption.getStatus() + " ===");
            System.out.println("=== Response object details ===");
            System.out.println("ID: " + updatedAdoption.getId());
            System.out.println("Status: " + updatedAdoption.getStatus());
            System.out.println("User: " + (updatedAdoption.getUser() != null ? updatedAdoption.getUser().getId() : "null"));
            System.out.println("Pet: " + (updatedAdoption.getPet() != null ? updatedAdoption.getPet().getId() : "null"));
            System.out.println("Admin Notes: " + updatedAdoption.getAdminNotes());
            System.out.println("Shelter Notes: " + updatedAdoption.getShelterNotes());
            
            return ResponseEntity.ok(updatedAdoption);
        } catch (Exception e) {
            System.err.println("=== Error in updateAdoptionStatus: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Test endpoint to create sample adoption (for development only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/test-create")
    public ResponseEntity<Adoption> createTestAdoption() {
        try {
            System.out.println("=== Creating test adoption ===");
            
            // Get first user and pet for testing
            List<User> users = userService.findAll();
            List<Pet> pets = petService.findAll();
            
            if (users.isEmpty() || pets.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            User testUser = users.get(0);
            Pet testPet = pets.get(0);
            
            Adoption testAdoption = new Adoption();
            testAdoption.setUser(testUser);
            testAdoption.setPet(testPet);
            testAdoption.setStatus(Adoption.Status.PENDING);
            testAdoption.setMessage("Test adoption for admin dashboard");
            // Removed phone and address - can be retrieved from user object
            testAdoption.setAppliedAt(LocalDateTime.now()); // Set application timestamp for test
            
            Adoption saved = adoptionService.save(testAdoption);
            System.out.println("=== Test adoption created with ID: " + saved.getId() + " ===");
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("=== Error creating test adoption: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Test endpoint to check user data (for development only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/test-user/{userId}")
    public ResponseEntity<User> testUserData(@PathVariable Long userId) {
        try {
            System.out.println("=== Testing user data for ID: " + userId + " ===");
            Optional<User> userOpt = userService.findById(userId);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("=== User Details ===");
                System.out.println("User ID: " + user.getId());
                System.out.println("Username: " + user.getUsername());
                System.out.println("Email: " + user.getEmail());
                System.out.println("Full Name: " + user.getFullName());
                System.out.println("Phone: " + user.getPhone());
                System.out.println("Address: " + user.getAddress());
                System.out.println("Role: " + user.getRole());
                return ResponseEntity.ok(user);
            } else {
                System.out.println("=== User not found ===");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("=== Error testing user data: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Test endpoint to update user phone and address (for development only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/test-user/{userId}")
    public ResponseEntity<User> updateTestUserData(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            System.out.println("=== Updating user data for ID: " + userId + " ===");
            System.out.println("Request data: " + request);
            
            Optional<User> userOpt = userService.findById(userId);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Update phone and address
                if (request.containsKey("phone")) {
                    user.setPhone(request.get("phone"));
                    System.out.println("Updated phone to: " + request.get("phone"));
                }
                
                if (request.containsKey("address")) {
                    user.setAddress(request.get("address"));
                    System.out.println("Updated address to: " + request.get("address"));
                }
                
                User savedUser = userService.save(user);
                System.out.println("=== User updated successfully ===");
                System.out.println("New phone: " + savedUser.getPhone());
                System.out.println("New address: " + savedUser.getAddress());
                
                return ResponseEntity.ok(savedUser);
            } else {
                System.out.println("=== User not found ===");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("=== Error updating user data: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 