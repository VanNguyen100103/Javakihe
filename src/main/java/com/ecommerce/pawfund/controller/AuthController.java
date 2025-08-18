package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.dto.AuthRequest;
import com.ecommerce.pawfund.dto.RegisterRequest;
import com.ecommerce.pawfund.entity.RefreshToken;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.entity.VerificationToken;
import com.ecommerce.pawfund.notification.NotificationService;
import com.ecommerce.pawfund.repository.RefreshTokenRepository;
import com.ecommerce.pawfund.repository.UserRepository;
import com.ecommerce.pawfund.repository.VerificationTokenRepository;
import com.ecommerce.pawfund.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private NotificationService notificationService;

    // Đơn giản: refresh token là 1 JWT khác với thời gian sống dài hơn
    private final Map<String, String> refreshTokenStore = new HashMap<>(); // user -> refreshToken

    @PostMapping(value = "/login", consumes = {"application/json", "application/x-www-form-urlencoded", "multipart/form-data"})
    @Transactional
    public ResponseEntity<?> login(@ModelAttribute AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Kiểm tra user có tồn tại và enabled không
            Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("User not found");
            User user = userOpt.get();
            
            // Kiểm tra tài khoản đã được kích hoạt chưa
            if (!user.isEnabled()) {
                return ResponseEntity.status(403).body("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực.");
            }
            
            String accessToken = jwtUtil.generateToken(userDetails.getUsername());
            String refreshToken = jwtUtil.generateRefreshToken(userDetails.getUsername());
            // Kiểm tra khóa tài khoản nếu không hoạt động lâu ngày (trừ ADMIN)
            if (user.getRole() != User.Role.ADMIN && user.getLastLogin() != null &&
                user.getLastLogin().isBefore(java.time.LocalDateTime.now().minusDays(180))) {
                return ResponseEntity.status(403).body("Tài khoản đã bị khóa do không hoạt động lâu ngày.");
            }
            // Cập nhật lastLogin
            user.setLastLogin(java.time.LocalDateTime.now());
            userRepository.save(user);

            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", accessToken);
            result.put("refreshToken", refreshToken);
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId()); // Add user ID
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("fullName", user.getFullName());
            userInfo.put("phone", user.getPhone());
            userInfo.put("address", user.getAddress());
            userInfo.put("role", user.getRole().name()); // Thêm role
            result.put("user", userInfo);

            return ResponseEntity.ok(result);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null) return ResponseEntity.badRequest().body("Missing refresh token");
        String username = jwtUtil.extractUsername(refreshToken);
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Invalid refresh token");
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(refreshToken);
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiredAt().isBefore(LocalDateTime.now()) || !jwtUtil.validateRefreshToken(refreshToken, username)) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
        String newAccessToken = jwtUtil.generateToken(username);
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", refreshToken);
        return ResponseEntity.ok(tokens);
    }

    @PostMapping(value = "/register", consumes = {"application/json", "application/x-www-form-urlencoded", "multipart/form-data"})
    public ResponseEntity<?> register(@ModelAttribute RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        String requestedRole = request.getRole() != null ? request.getRole().toUpperCase() : "ADOPTER";
        if (requestedRole.equals("ADMIN") || requestedRole.equals("SHELTER")) {
            return ResponseEntity.badRequest().body("Bạn không thể đăng ký với vai trò này!");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setEnabled(false); // Chưa xác thực email
        if (requestedRole.equals("SHELTER_STAFF")) {
            user.setRole(User.Role.SHELTER_STAFF);
        } else {
            try {
                user.setRole(User.Role.valueOf(requestedRole));
            } catch (Exception e) {
                user.setRole(User.Role.ADOPTER);
            }
        }
        userRepository.save(user);
        // Sinh token xác thực
        String token = java.util.UUID.randomUUID().toString();
        VerificationToken vt = new VerificationToken();
        vt.setUser(user);
        vt.setToken(token);
        vt.setExpiredAt(java.time.LocalDateTime.now().plusDays(1));
        verificationTokenRepository.save(vt);
        // Gửi email xác thực
        String verifyLink = "http://localhost:8888/api/auth/verify?token=" + token;
        notificationService.sendEmail(user.getEmail(), "Xác thực tài khoản PawFund", "Vui lòng bấm vào link sau để xác thực tài khoản: " + verifyLink);
        return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        Optional<VerificationToken> vtOpt = verificationTokenRepository.findByToken(token);
        if (vtOpt.isEmpty() || vtOpt.get().getExpiredAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
        }
        User user = vtOpt.get().getUser();
        user.setEnabled(true);
        userRepository.save(user);
        verificationTokenRepository.delete(vtOpt.get());
        return ResponseEntity.ok("Xác thực email thành công! Bạn có thể đăng nhập.");
    }
}