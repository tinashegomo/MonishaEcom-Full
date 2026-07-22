package com.tinasheGomo.MonishaEcomBackend.dto.ims.response;

import lombok.Data;

import java.util.UUID;

@Data
public class ImsProductSizeDTO {

    private UUID productSizeId;
    private String size;
    private Integer quantity;
}
