package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.entity.Pet;
import com.ecommerce.pawfund.entity.Adoption;
import com.ecommerce.pawfund.entity.Donation;
import com.ecommerce.pawfund.service.inter.IUserService;
import com.ecommerce.pawfund.service.inter.IPetService;
import com.ecommerce.pawfund.service.inter.IAdoptionService;
import com.ecommerce.pawfund.service.inter.IDonationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private IUserService userService;
    
    @Autowired
    private IPetService petService;
    
    @Autowired
    private IAdoptionService adoptionService;
    
    @Autowired
    private IDonationService donationService;

    // Get recent activities - Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/recent-activities")
    public ResponseEntity<Map<String, Object>> getRecentActivities() {
        try {
            // Get recent users (last 7 days)
            LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
            List<User> recentUsers = userService.findAll().stream()
                .filter(user -> user.getLastLogin() != null && user.getLastLogin().isAfter(weekAgo))
                .limit(5)
                .collect(Collectors.toList());

            // Get recent adoptions (last 7 days)
            List<Adoption> recentAdoptions = adoptionService.findAll().stream()
                .filter(adoption -> adoption.getAppliedAt() != null && adoption.getAppliedAt().isAfter(weekAgo))
                .limit(5)
                .collect(Collectors.toList());

            // Get recent donations (last 7 days)
            List<Donation> recentDonations = donationService.findAll().stream()
                .filter(donation -> donation.getDonatedAt() != null && donation.getDonatedAt().isAfter(weekAgo))
                .limit(5)
                .collect(Collectors.toList());

            // Format activities
            List<Map<String, Object>> activities = new ArrayList<>();

            // Add recent user registrations
            for (User user : recentUsers) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "user_registration");
                activity.put("title", "Người dùng mới đăng ký");
                activity.put("description", user.getUsername() + " đã đăng ký tài khoản");
                activity.put("timestamp", user.getLastLogin());
                activity.put("color", "green");
                activities.add(activity);
            }

            // Add recent adoptions
            for (Adoption adoption : recentAdoptions) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "adoption_request");
                activity.put("title", "Đơn nhận nuôi mới");
                activity.put("description", "Đơn nhận nuôi cho thú cưng #" + adoption.getPet().getId());
                activity.put("timestamp", adoption.getAppliedAt());
                activity.put("color", "blue");
                activities.add(activity);
            }

            // Add recent donations
            for (Donation donation : recentDonations) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "donation");
                activity.put("title", "Quyên góp mới");
                activity.put("description", "Quyên góp " + donation.getAmount() + " VNĐ từ " + 
                    (donation.getUser() != null ? donation.getUser().getUsername() : "Anonymous"));
                activity.put("timestamp", donation.getDonatedAt());
                activity.put("color", "purple");
                activities.add(activity);
            }

            // Sort by timestamp (most recent first)
            activities.sort((a, b) -> {
                LocalDateTime timeA = (LocalDateTime) a.get("timestamp");
                LocalDateTime timeB = (LocalDateTime) b.get("timestamp");
                return timeB.compareTo(timeA);
            });

            // Take only the most recent 10 activities
            activities = activities.stream().limit(10).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("activities", activities);
            response.put("totalActivities", activities.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get recent activities: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 