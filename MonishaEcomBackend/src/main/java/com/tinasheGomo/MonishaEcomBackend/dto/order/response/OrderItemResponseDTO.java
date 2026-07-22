package com.tinasheGomo.MonishaEcomBackend.dto.order.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class OrderItemResponseDTO {

    private UUID orderItemId;
    private String type;
    private String variant;
    private String color;
    private String size;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private Boolean customMade;
    private UUID productId;
    private UUID batchId;
}
