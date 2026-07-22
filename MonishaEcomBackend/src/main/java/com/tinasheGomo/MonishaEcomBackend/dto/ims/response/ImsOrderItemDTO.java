package com.tinasheGomo.MonishaEcomBackend.dto.ims.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ImsOrderItemDTO {

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
