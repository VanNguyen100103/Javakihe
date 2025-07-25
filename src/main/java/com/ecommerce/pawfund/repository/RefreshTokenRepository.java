package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.RefreshToken;
import com.ecommerce.pawfund.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
} 