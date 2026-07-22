package com.tinasheGomo.MonishaEcomBackend.dto.cart.response;

import lombok.Data;

import java.util.UUID;

@Data
public class CartItemResponseDTO {

    private UUID cartItemId;
    private UUID imsProductId;
    private UUID imsProductSizeId;
    private String productName;
    private Integer unitPrice;
    private String size;
    private Integer quantity;
    private Integer lineTotal;
}
