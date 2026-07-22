package com.tinasheGomo.MonishaEcomBackend.dto.ims.response;

import lombok.Data;

import java.util.UUID;

@Data
public class ImsCustomerDTO {

    private UUID customerId;
    private String customerName;
    private String phoneNumber;
}
