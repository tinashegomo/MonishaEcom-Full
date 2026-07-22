package com.tinasheGomo.MonishaEcomBackend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Configuration for communicating with the IMS backend.
 * Each key grants access to a specific set of IMS public endpoints.
 */
@Component
@Getter
public class ImsConfig {

    // Base URL of the IMS backend (e.g., http://localhost:8080)
    @Value("${ims.base-url}")
    private String baseUrl;

    // Secret key for viewing the product catalog (read-only)
    // Grants access to: GET /api/public/imsClient/products, GET /api/public/imsClient/products/{id}
    @Value("${ims.api-keys.ecom-catalog}")
    private String catalogKey;

    // Secret key for signing up and syncing customers
    // Grants access to: POST /api/public/imsClient/customers
    @Value("${ims.api-keys.ecom-customers}")
    private String customersKey;

    // Secret key for creating orders and viewing order history
    // Grants access to: POST /api/public/imsClient/orders, GET /api/public/imsClient/orders/customer/{id}
    @Value("${ims.api-keys.ecom-orders}")
    private String ordersKey;
}
