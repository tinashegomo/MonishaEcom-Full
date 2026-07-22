package com.tinasheGomo.MonishaEcomBackend.entity.wishlist;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wishlist")
@Getter
@Setter
@NoArgsConstructor
public class WishlistEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID wishlistId;

    @Column(nullable = false)
    private UUID customerUserId;

    // Reference to product in IMS database
    @Column(nullable = false)
    private UUID imsProductId;

    // Denormalized product info for display
    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Integer productPrice;

    @Column(nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private LocalDateTime addedAt;

    @PrePersist
    public void onCreate() {
        this.addedAt = LocalDateTime.now();
    }
}
