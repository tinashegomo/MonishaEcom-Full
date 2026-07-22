package com.tinasheGomo.MonishaEcomBackend.entity.cart;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cart_item")
@Getter
@Setter
@NoArgsConstructor
public class CartItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID cartItemId;

    // Reference to product in IMS database
    @Column(nullable = false)
    private UUID imsProductId;

    // Reference to product size in IMS database (optional — for specific size selection)
    @Column
    private UUID imsProductSizeId;

    // Denormalized product info for display (refreshed on cart view)
    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Integer unitPrice;

    @Column
    private String size;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private CartEntity cart;
}
