package com.tinasheGomo.MonishaEcomBackend.repository;

import com.tinasheGomo.MonishaEcomBackend.entity.cart.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, UUID> {

    Optional<CartEntity> findByCustomerUserId(UUID customerUserId);
}
