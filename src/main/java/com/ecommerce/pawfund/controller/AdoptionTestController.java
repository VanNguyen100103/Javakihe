package com.ecommerce.pawfund.controller;

import com.ecommerce.pawfund.entity.AdoptionTestResult;
import com.ecommerce.pawfund.entity.User;
import com.ecommerce.pawfund.repository.AdoptionTestResultRepository;
import com.ecommerce.pawfund.service.inter.IUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/adoption-test")
public class AdoptionTestController {
    @Autowired
    private AdoptionTestResultRepository adoptionTestResultRepository;
    @Autowired
    private IUserService userService;

    // Đáp án đúng hardcode cho 10 câu đúng/sai
    private static final Map<Integer, Boolean> correctAnswers = Map.of(
        1, true,
        2, false,
        3, true,
        4, true,
        5, false,
        6, true,
        7, false,
        8, true,
        9, false,
        10, true
    );

    @PostMapping(value = "/submit", consumes = {"application/x-www-form-urlencoded", "application/json"})
    public ResponseEntity<?> submitTest(@ModelAttribute AdoptionTestAnswers answers, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");

        int score = 0;
        if (Boolean.TRUE.equals(answers.getQ1()) == correctAnswers.get(1)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ2()) == correctAnswers.get(2)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ3()) == correctAnswers.get(3)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ4()) == correctAnswers.get(4)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ5()) == correctAnswers.get(5)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ6()) == correctAnswers.get(6)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ7()) == correctAnswers.get(7)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ8()) == correctAnswers.get(8)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ9()) == correctAnswers.get(9)) score += 10;
        if (Boolean.TRUE.equals(answers.getQ10()) == correctAnswers.get(10)) score += 10;
        score = Math.min(score, 100);

        AdoptionTestResult result = new AdoptionTestResult();
        result.setUser(user);
        result.setScore(score);
        result.setCreatedAt(java.time.LocalDateTime.now());
        adoptionTestResultRepository.save(result);

        // Chuẩn bị thông tin user trả về
        java.util.Map<String, Object> userInfo = new java.util.HashMap<>();
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("fullName", user.getFullName());
        userInfo.put("phone", user.getPhone());
        userInfo.put("address", user.getAddress());
       

        return ResponseEntity.ok(java.util.Map.of(
            "score", score,
            "user", userInfo
        ));
    }
}

// DTO cho bài test
class AdoptionTestAnswers {
    private Boolean q1, q2, q3, q4, q5, q6, q7, q8, q9, q10;
    public Boolean getQ1() { return q1; }
    public void setQ1(Boolean q1) { this.q1 = q1; }
    public Boolean getQ2() { return q2; }
    public void setQ2(Boolean q2) { this.q2 = q2; }
    public Boolean getQ3() { return q3; }
    public void setQ3(Boolean q3) { this.q3 = q3; }
    public Boolean getQ4() { return q4; }
    public void setQ4(Boolean q4) { this.q4 = q4; }
    public Boolean getQ5() { return q5; }
    public void setQ5(Boolean q5) { this.q5 = q5; }
    public Boolean getQ6() { return q6; }
    public void setQ6(Boolean q6) { this.q6 = q6; }
    public Boolean getQ7() { return q7; }
    public void setQ7(Boolean q7) { this.q7 = q7; }
    public Boolean getQ8() { return q8; }
    public void setQ8(Boolean q8) { this.q8 = q8; }
    public Boolean getQ9() { return q9; }
    public void setQ9(Boolean q9) { this.q9 = q9; }
    public Boolean getQ10() { return q10; }
    public void setQ10(Boolean q10) { this.q10 = q10; }
} 