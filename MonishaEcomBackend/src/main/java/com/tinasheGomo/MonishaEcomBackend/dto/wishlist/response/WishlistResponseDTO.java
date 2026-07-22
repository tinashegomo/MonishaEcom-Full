package com.tinasheGomo.MonishaEcomBackend.dto.wishlist.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class WishlistResponseDTO {

    private UUID wishlistId;
    private UUID imsProductId;
    private String productName;
    private Integer productPrice;
    private LocalDateTime addedAt;
}
