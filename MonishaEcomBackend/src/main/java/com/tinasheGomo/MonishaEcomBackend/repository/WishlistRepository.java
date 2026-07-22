package com.tinasheGomo.MonishaEcomBackend.repository;

import com.tinasheGomo.MonishaEcomBackend.entity.wishlist.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistEntity, UUID> {

    List<WishlistEntity> findByCustomerUserIdOrderByAddedAtDesc(UUID customerUserId);

    Optional<WishlistEntity> findByCustomerUserIdAndImsProductId(UUID customerUserId, UUID imsProductId);

    boolean existsByCustomerUserIdAndImsProductId(UUID customerUserId, UUID imsProductId);
}
