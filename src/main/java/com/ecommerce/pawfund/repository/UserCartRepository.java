package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.UserCart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserCartRepository extends JpaRepository<UserCart, Long> {
    Optional<UserCart> findByUserId(Long userId);
} 