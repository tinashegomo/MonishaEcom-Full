package com.tinasheGomo.MonishaEcomBackend.dto.ims.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ImsProductDTO {

    private UUID productId;
    private String productName;
    private Integer productPrice;
    private Integer totalPrice;
    private UUID schoolId;
    private String schoolName;
    private UUID batchId;
    private String batchName;
    private String type;
    private String variant;
    private String color;
    private Integer totalQuantity;
    private String description;
    private List<ImsProductSizeDTO> productSizes;
    private String depletedAt;
}
