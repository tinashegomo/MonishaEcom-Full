package com.tinasheGomo.MonishaEcomBackend.dto.wishlist.request;

import lombok.Data;

import java.util.UUID;

@Data
public class AddToWishlistRequestDTO {

    private UUID imsProductId;
}
