package com.tinasheGomo.MonishaEcomBackend.dto.cart.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CartResponseDTO {

    private UUID cartId;
    private List<CartItemResponseDTO> items;
    private Integer totalItems;
    private Integer totalAmount;
}
