package com.tinasheGomo.MonishaEcomBackend.repository;

import com.tinasheGomo.MonishaEcomBackend.entity.cart.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, UUID> {

    @Query("SELECT ci FROM CartItemEntity ci WHERE ci.cart.cartId = :cartId")
    List<CartItemEntity> findByCartId(@Param("cartId") UUID cartId);

    @Modifying
    @Query("DELETE FROM CartItemEntity ci WHERE ci.cart.cartId = :cartId")
    void deleteByCartId(@Param("cartId") UUID cartId);
}
