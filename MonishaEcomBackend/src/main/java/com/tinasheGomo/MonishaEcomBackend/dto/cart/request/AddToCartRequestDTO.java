package com.tinasheGomo.MonishaEcomBackend.dto.cart.request;

import lombok.Data;

import java.util.UUID;

@Data
public class AddToCartRequestDTO {

    private UUID imsProductId;
    private UUID imsProductSizeId;
    private String size;
    private Integer quantity;
}
