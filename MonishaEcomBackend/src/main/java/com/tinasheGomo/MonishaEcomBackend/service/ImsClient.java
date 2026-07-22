package com.tinasheGomo.MonishaEcomBackend.service;

import com.tinasheGomo.MonishaEcomBackend.config.ImsConfig;
import com.tinasheGomo.MonishaEcomBackend.dto.ims.response.ImsCustomerDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.ims.response.ImsOrderDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.ims.response.ImsProductDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImsClient {

    private static final Logger log = LoggerFactory.getLogger(ImsClient.class);
    private final ImsConfig imsConfig;

    private final RestClient restClient = RestClient.create();

    // ============================================================
    //                    PRODUCT CATALOG (ecom-catalog key)
    // ============================================================

    public List<ImsProductDTO> getAllProducts() {
        return restClient.get()
                .uri(imsConfig.getBaseUrl() + "/api/public/imsClient/products")
                .header("X-Internal-Api-Key", imsConfig.getCatalogKey())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public ImsProductDTO getProductById(UUID productId) {
        return restClient.get()
                .uri(imsConfig.getBaseUrl() + "/api/public/imsClient/products/{id}", productId)
                .header("X-Internal-Api-Key", imsConfig.getCatalogKey())
                .retrieve()
                .body(ImsProductDTO.class);
    }

    // ============================================================
    //                    CUSTOMERS (ecom-customers key)
    // ============================================================

    public ImsCustomerDTO findOrCreateCustomer(String customerName, String phoneNumber) {
        return restClient.post()
                .uri(imsConfig.getBaseUrl() + "/api/public/imsClient/customers")
                .header("X-Internal-Api-Key", imsConfig.getCustomersKey())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "customerName", customerName,
                        "phoneNumber", phoneNumber
                ))
                .retrieve()
                .body(ImsCustomerDTO.class);
    }

    // ============================================================
    //                    ORDERS (ecom-orders key)
    // ============================================================

    public ImsOrderDTO createOrder(UUID customerId, List<Map<String, Object>> orderItems,
                                   java.math.BigDecimal paidAmount, String paymentType, String notes) {
        Map<String, Object> body = Map.of(
                "customerId", customerId,
                "orderItems", orderItems,
                "paidAmount", paidAmount,
                "paymentType", paymentType,
                "notes", notes != null ? notes : ""
        );
        log.info("IMS createOrder request: customerId={}, paymentType={}, paidAmount={}, items={}",
                customerId, paymentType, paidAmount, orderItems.size());

        return restClient.post()
                .uri(imsConfig.getBaseUrl() + "/api/public/imsClient/orders")
                .header("X-Internal-Api-Key", imsConfig.getOrdersKey())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    String responseBody = new String(response.getBody().readAllBytes());
                    log.error("IMS 4xx error on createOrder: status={}, body={}", response.getStatusCode(), responseBody);
                    throw new RuntimeException("IMS returned " + response.getStatusCode() + ": " + responseBody);
                })
                .body(ImsOrderDTO.class);
    }

    public List<ImsOrderDTO> getOrdersByCustomer(UUID customerId) {
        return restClient.get()
                .uri(imsConfig.getBaseUrl() + "/api/public/imsClient/orders/customer/{customerId}", customerId)
                .header("X-Internal-Api-Key", imsConfig.getOrdersKey())
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
