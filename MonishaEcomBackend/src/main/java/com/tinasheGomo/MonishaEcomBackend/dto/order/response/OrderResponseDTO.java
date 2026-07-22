package com.tinasheGomo.MonishaEcomBackend.dto.order.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class OrderResponseDTO {

    private UUID orderId;
    private String orderNumber;
    private String customerName;
    private String customerPhone;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balance;
    private Boolean fullyPaid;
    private String paymentType;
    private String orderStatus;
    private String notes;
    private String createdAt;
    private List<OrderItemResponseDTO> orderItems;
}
