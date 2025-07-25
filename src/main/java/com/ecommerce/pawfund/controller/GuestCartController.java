package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.GuestCart;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.repository.GuestCartRepository;
import com.ecommerce.pawfund.repository.UserRepository;
import com.ecommerce.pawfund.repository.UserCartRepository;
import com.ecommerce.pawfund.service.inter.IPetService;
import com.ecommerce.pawfund.dto.PetResponseDTO;
import com.ecommerce.pawfund.entity.UserCart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.UUID; // Thêm import này

class GuestCartResponseDTO {
    private String token;
    private List<PetResponseDTO> pets;
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public List<PetResponseDTO> getPets() { return pets; }
    public void setPets(List<PetResponseDTO> pets) { this.pets = pets; }
}

@RestController
@RequestMapping("/api/guest-cart")
public class GuestCartController {
    @Autowired
    private GuestCartRepository guestCartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserCartRepository userCartRepository;
    @Autowired
    private IPetService petService;

    // Thêm pet vào cart guest hoặc user
    @PostMapping(value = "/add", consumes = {"application/x-www-form-urlencoded", "application/json"})
    public ResponseEntity<?> addToCart(
        @RequestParam(value = "token", required = false) String token,
        @RequestParam("petId") Long petId,
        Authentication authentication
    ) {
        if (petId == null) return ResponseEntity.badRequest().body("Missing petId");
        if (!petService.findById(petId).isPresent()) {
            return ResponseEntity.badRequest().body("Pet not found");
        }
        // Nếu user đã đăng nhập, thêm vào UserCart
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("User not found");
            User user = userOpt.get();
            UserCart userCart = userCartRepository.findByUserId(user.getId()).orElseGet(() -> {
                UserCart c = new UserCart();
                c.setUser(user);
                c.setCreatedAt(LocalDateTime.now());
                c.setPetIds(new ArrayList<>());
                return c;
            });
            if (!userCart.getPetIds().contains(petId)) {
                userCart.getPetIds().add(petId);
            }
            userCart.setUpdatedAt(LocalDateTime.now());
            userCartRepository.save(userCart);
            // Trả về danh sách pet trong cart user
            List<PetResponseDTO> pets = new ArrayList<>();
            for (Long id : userCart.getPetIds()) {
                petService.findById(id).ifPresent(pet -> pets.add(toPetResponseDTO(pet)));
            }
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("pets", pets);
            return ResponseEntity.ok(response);
        }
        // Nếu chưa đăng nhập, thêm vào GuestCart như cũ
        if (token == null || token.isEmpty()) {
            token = UUID.randomUUID().toString();
        }
        final String finalToken = token;
        GuestCart cart = guestCartRepository.findById(finalToken).orElseGet(() -> {
            GuestCart c = new GuestCart();
            c.setToken(finalToken);
            c.setCreatedAt(LocalDateTime.now());
            c.setPetIds(new ArrayList<>());
            return c;
        });
        if (!cart.getPetIds().contains(petId)) {
            cart.getPetIds().add(petId);
        }
        cart.setUpdatedAt(LocalDateTime.now());
        guestCartRepository.save(cart);
        // Trả về DTO kèm token (để client lưu lại)
        GuestCartResponseDTO response = toGuestCartResponseDTO(cart);
        response.setToken(token);
        return ResponseEntity.ok(response);
    }

    // Lấy cart của guest
    @GetMapping
    public ResponseEntity<?> getCart(@RequestParam("token") String token) {
        Optional<GuestCart> cartOpt = guestCartRepository.findById(token);
        if (cartOpt.isPresent()) {
            return ResponseEntity.ok(toGuestCartResponseDTO(cartOpt.get()));
        } else {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    // Lấy cart của user đã đăng nhập
    @GetMapping("/user-cart")
    public ResponseEntity<?> getUserCart(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(String.valueOf(authentication.getPrincipal()))) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).body("User not found");
        User user = userOpt.get();
        UserCart userCart = userCartRepository.findByUserId(user.getId()).orElse(null);
        if (userCart == null || userCart.getPetIds().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        List<PetResponseDTO> pets = new ArrayList<>();
        for (Long petId : userCart.getPetIds()) {
            petService.findById(petId).ifPresent(pet -> pets.add(toPetResponseDTO(pet)));
        }
        return ResponseEntity.ok(pets);
    }

    // Merge cart guest vào user khi đăng nhập
    @PostMapping("/merge")
    public ResponseEntity<?> mergeCart(@RequestParam("token") String token, Authentication authentication) {
        if (token == null || token.isEmpty()) return ResponseEntity.badRequest().body("Missing token");
        Optional<GuestCart> guestCartOpt = guestCartRepository.findById(token);
        if (guestCartOpt.isEmpty()) return ResponseEntity.ok("No guest cart to merge");
        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).body("User not found");
        User user = userOpt.get();

        // Lấy hoặc tạo user cart
        UserCart userCart = userCartRepository.findByUserId(user.getId()).orElseGet(() -> {
            UserCart c = new UserCart();
            c.setUser(user);
            c.setCreatedAt(LocalDateTime.now());
            c.setPetIds(new ArrayList<>());
            return c;
        });

        // Merge petIds
        List<Long> guestPetIds = guestCartOpt.get().getPetIds();
        for (Long petId : guestPetIds) {
            if (!userCart.getPetIds().contains(petId)) {
                userCart.getPetIds().add(petId);
            }
        }
        userCart.setUpdatedAt(LocalDateTime.now());
        userCartRepository.save(userCart);

        guestCartRepository.deleteById(token);

        return ResponseEntity.ok("Merged guest cart into user cart!");
    }

    // Helper chuyển Pet sang PetResponseDTO (tái sử dụng logic từ PetController)
    private PetResponseDTO toPetResponseDTO(com.ecommerce.pawfund.entity.Pet pet) {
        PetResponseDTO dto = new PetResponseDTO();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setImageUrls(pet.getImageUrls());
        dto.setDescription(pet.getDescription());
        dto.setAge(pet.getAge());
        dto.setBreed(pet.getBreed());
        dto.setLocation(pet.getLocation());
        dto.setStatus(pet.getStatus() != null ? pet.getStatus().name() : null);
        dto.setShelter(toShelterDTO(pet.getShelter()));
        return dto;
    }

    private com.ecommerce.pawfund.dto.ShelterDTO toShelterDTO(com.ecommerce.pawfund.entity.User shelter) {
        if (shelter == null) return null;
        com.ecommerce.pawfund.dto.ShelterDTO dto = new com.ecommerce.pawfund.dto.ShelterDTO();
        dto.setUsername(shelter.getUsername());
        dto.setEmail(shelter.getEmail());
        dto.setFullName(shelter.getFullName());
        dto.setPhone(shelter.getPhone());
        dto.setAddress(shelter.getAddress());
        return dto;
    }

    private GuestCartResponseDTO toGuestCartResponseDTO(GuestCart cart) {
        GuestCartResponseDTO dto = new GuestCartResponseDTO();
        dto.setToken(cart.getToken());
        List<PetResponseDTO> pets = new ArrayList<>();
        for (Long petId : cart.getPetIds()) {
            petService.findById(petId).ifPresent(pet -> pets.add(toPetResponseDTO(pet)));
        }
        dto.setPets(pets);
        return dto;
    }
} 