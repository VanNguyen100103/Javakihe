package com.ecommerce.pawfund.repository;

import com.ecommerce.pawfund.entity.GuestCart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestCartRepository extends JpaRepository<GuestCart, String> {
} 