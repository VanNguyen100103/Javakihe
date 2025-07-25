package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.Adoption;
import com.ecommerce.pawfund.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
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
                                                       @RequestParam(required = false) Long petId) {
        if (userId != null) return adoptionService.findByUserId(userId);
        if (petId != null) return adoptionService.findByPetId(petId);
        return adoptionService.findAll();
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
        app.setPhone(dto.getPhone());
        app.setAddress(dto.getAddress());
        // Duyệt tự động dựa trên điểm
        if (score >= 70) {
            app.setStatus(Adoption.Status.APPROVED);
        } else {
            app.setStatus(Adoption.Status.REJECTED);
        }
        Adoption saved = adoptionService.save(app);
        // Gửi email xác nhận cho adopter
        if (saved.getUser() != null && saved.getUser().getEmail() != null) {
            String subject = "Kết quả đơn xin nhận nuôi";
            String text = "Đơn xin nhận nuôi của bạn cho thú cưng: " + (saved.getPet() != null ? saved.getPet().getName() : "") +
                    " đã được " + (saved.getStatus() == Adoption.Status.APPROVED ? "DUYỆT" : "TỪ CHỐI") +
                    ". Điểm bài test của bạn: " + score + ".";
            notificationService.sendEmail(saved.getUser().getEmail(), subject, text);
        }
        // Gửi email thông báo cho shelter staff
        if (saved.getPet() != null && saved.getPet().getShelter() != null && saved.getPet().getShelter().getEmail() != null) {
            notificationService.sendEmail(
                saved.getPet().getShelter().getEmail(),
                "Có đơn xin nhận nuôi mới",
                "Có một đơn xin nhận nuôi mới cho thú cưng: " + saved.getPet().getName() + ". Trạng thái: " + (saved.getStatus() == Adoption.Status.APPROVED ? "DUYỆT" : "TỪ CHỐI")
            );
        }
        return saved;
    }

    @PreAuthorize("hasRole('ADOPTER')")
    @PostMapping("/from-cart")
    public ResponseEntity<?> adoptFromCart(@ModelAttribute AdoptionRequestDTO dto, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }
        UserCart userCart = userCartRepository.findByUserId(user.getId()).orElse(null);
        if (userCart == null || userCart.getPetIds().isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty");
        }
        int score = 0;
        AdoptionTestResult testResult = adoptionTestResultRepository.findTopByUserOrderByCreatedAtDesc(user).orElse(null);
        if (testResult != null) {
            score = testResult.getScore();
        }
        List<Adoption> createdAdoptions = new java.util.ArrayList<>();
        StringBuilder summary = new StringBuilder();
        summary.append("Bạn đã gửi đơn xin nhận nuôi cho các thú cưng sau:\n");
        for (Long petId : userCart.getPetIds()) {
            Pet pet = petService.findById(petId).orElse(null);
            if (pet == null) continue;
            Adoption app = new Adoption();
            app.setUser(user);
            app.setPet(pet);
            app.setMessage(dto.getMessage());
            app.setPhone(dto.getPhone());
            app.setAddress(dto.getAddress());
            if (score >= 70) {
                app.setStatus(Adoption.Status.APPROVED);
            } else {
                app.setStatus(Adoption.Status.REJECTED);
            }
            Adoption saved = adoptionService.save(app);
            createdAdoptions.add(saved);
            summary.append("- ")
                .append(pet.getName())
                .append(": ")
                .append(saved.getStatus() == Adoption.Status.APPROVED ? "ĐƯỢC DUYỆT" : "BỊ TỪ CHỐI")
                .append("\n");
            // Gửi email cho shelter staff từng pet như cũ
            if (saved.getPet() != null && saved.getPet().getShelter() != null && saved.getPet().getShelter().getEmail() != null) {
                notificationService.sendEmail(
                    saved.getPet().getShelter().getEmail(),
                    "Có đơn xin nhận nuôi mới",
                    "Có một đơn xin nhận nuôi mới cho thú cưng: " + saved.getPet().getName() + ". Trạng thái: " + (saved.getStatus() == Adoption.Status.APPROVED ? "DUYỆT" : "TỪ CHỐI")
                );
            }
        }
        summary.append("\nĐiểm bài test của bạn: ").append(score).append(".");
        // Gửi 1 email tổng hợp cho user
        if (user.getEmail() != null) {
            notificationService.sendEmail(
                user.getEmail(),
                "Kết quả đơn xin nhận nuôi",
                summary.toString()
            );
        }
        return ResponseEntity.ok(createdAdoptions);
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
} 