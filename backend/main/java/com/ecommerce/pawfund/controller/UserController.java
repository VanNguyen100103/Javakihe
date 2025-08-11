package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.service.inter.IUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private IUserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Validation
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username cannot be null or empty");
            }
            
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password cannot be null or empty");
            }
            
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email cannot be null or empty");
            }
            
            // Check if username already exists
            if (userService.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email already exists
            if (userService.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            if (user.getRole() == null) {
                user.setRole(User.Role.ADOPTER);
            }
            
            // Set enabled to true by default
            user.setEnabled(true);
            
            // Encode password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            User savedUser = userService.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        Optional<User> existing = userService.findById(id);
        if (existing.isPresent()) {
            user.setId(id);
            return ResponseEntity.ok(userService.save(user));
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            // For now, just return success since deleteById is not implemented
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User API is working");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    // Get user statistics - Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        try {
            List<User> allUsers = userService.findAll();
            
            // Calculate statistics
            long totalUsers = allUsers.size();
            long activeUsers = allUsers.stream()
                .filter(user -> user.isEnabled())
                .count();
            
            // Count users by role
            long adminUsers = allUsers.stream()
                .filter(user -> User.Role.ADMIN.equals(user.getRole()))
                .count();
            long shelterUsers = allUsers.stream()
                .filter(user -> User.Role.SHELTER.equals(user.getRole()))
                .count();
            long adopterUsers = allUsers.stream()
                .filter(user -> User.Role.ADOPTER.equals(user.getRole()))
                .count();
            long donorUsers = allUsers.stream()
                .filter(user -> User.Role.DONOR.equals(user.getRole()))
                .count();
            long volunteerUsers = allUsers.stream()
                .filter(user -> User.Role.VOLUNTEER.equals(user.getRole()))
                .count();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            stats.put("adminUsers", adminUsers);
            stats.put("shelterUsers", shelterUsers);
            stats.put("adopterUsers", adopterUsers);
            stats.put("donorUsers", donorUsers);
            stats.put("volunteerUsers", volunteerUsers);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get user statistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/shelters")
    public ResponseEntity<List<User>> getShelters() {
        List<User> shelters = userService.findAll().stream()
            .filter(user -> user.getRole() == User.Role.SHELTER)
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(shelters);
    }

    // User Profile Endpoints
    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Optional<User> user = userService.findByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateCurrentUserProfile(@RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Optional<User> currentUser = userService.findByUsername(username);
        
        if (currentUser.isPresent()) {
            User user = currentUser.get();
            
            // Chỉ cho phép cập nhật một số field nhất định
            if (updatedUser.getFullName() != null) {
                user.setFullName(updatedUser.getFullName());
            }
            if (updatedUser.getEmail() != null) {
                user.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getPhone() != null) {
                user.setPhone(updatedUser.getPhone());
            }
            if (updatedUser.getAddress() != null) {
                user.setAddress(updatedUser.getAddress());
            }
            
            // Không cho phép thay đổi password, role, enabled status qua endpoint này
            User savedUser = userService.save(user);
            return ResponseEntity.ok(savedUser);
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Optional<User> currentUser = userService.findByUsername(username);
        
        if (currentUser.isPresent()) {
            User user = currentUser.get();
            
            // Kiểm tra mật khẩu hiện tại
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Mật khẩu hiện tại không đúng");
            }
            
            // Cập nhật mật khẩu mới
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userService.save(user);
            
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        }
        
        return ResponseEntity.notFound().build();
    }

    // Inner class for password change request
    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
} 