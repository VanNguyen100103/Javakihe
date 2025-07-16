package com.pawfund.modules.user.controller;

import com.pawfund.modules.common.dto.ApiResponse;
import com.pawfund.modules.user.dto.UserCreateDTO;
import com.pawfund.modules.user.dto.UserDTO;
import com.pawfund.modules.user.dto.UserUpdateDTO;
import com.pawfund.modules.user.model.User;
import com.pawfund.modules.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserDTO(user)));
    }

    @GetMapping("/shelters")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllShelters() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllShelters()));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserUpdateDTO updateDTO) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(user.getId(), updateDTO)));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(user.getId(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateRoleRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUserRole(id, request.getRole())));
    }
}

record ChangePasswordRequest(String currentPassword, String newPassword) {}
record UpdateRoleRequest(String role) {}
