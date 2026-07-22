package com.tinasheGomo.MonishaEcomBackend.dto.ims.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ImsOrderDTO {

    private UUID orderId;
    private String orderNumber;
    private UUID customerId;
    private String customerName;
    private String customerPhone;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balance;
    private Boolean fullyPaid;
    private String paymentType;
    private Boolean hasMeasurements;
    private Boolean schoolOrder;
    private String orderStatus;
    private String collectionDate;
    private String notes;
    private String createdBy;
    private String createdAt;
    private String updatedAt;
    private List<ImsOrderItemDTO> orderItems;
}
