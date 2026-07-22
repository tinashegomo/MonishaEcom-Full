package com.tinasheGomo.MonishaEcomBackend.controller.product;

import com.tinasheGomo.MonishaEcomBackend.dto.ims.response.ImsProductDTO;
import com.tinasheGomo.MonishaEcomBackend.service.ImsClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaEcom/products")
@RequiredArgsConstructor
public class ProductController {

    private final ImsClient imsClient;

    @GetMapping
    public List<ImsProductDTO> getAllProducts() {
        return imsClient.getAllProducts();
    }

    @GetMapping("/{productId}")
    public ImsProductDTO getProductById(@PathVariable UUID productId) {
        return imsClient.getProductById(productId);
    }
}
