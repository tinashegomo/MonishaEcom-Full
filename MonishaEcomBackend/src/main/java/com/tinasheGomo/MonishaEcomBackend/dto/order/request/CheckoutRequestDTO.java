package com.tinasheGomo.MonishaEcomBackend.dto.order.request;

import com.tinasheGomo.MonishaEcomBackend.enums.PaymentType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckoutRequestDTO {

    // Payment amount — 0 for cash on collection, full amount for prepayment
    private BigDecimal paidAmount;

    // Optional notes
    private String notes;

    // Payment type: CARD or MOBILE_MONEY
    private PaymentType paymentType;
}
