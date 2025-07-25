package com.ecommerce.pawfund.service.inter;

import com.ecommerce.pawfund.entity.User;
import java.util.List;
import java.util.Optional;

public interface IUserService {
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    User save(User user);
    List<User> findAll();
} 