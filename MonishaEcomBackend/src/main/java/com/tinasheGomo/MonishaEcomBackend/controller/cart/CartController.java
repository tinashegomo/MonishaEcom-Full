package com.tinasheGomo.MonishaEcomBackend.controller.cart;

import com.tinasheGomo.MonishaEcomBackend.dto.cart.request.AddToCartRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.cart.response.CartResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/monishaEcom/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponseDTO getCart() {
        return cartService.getCart();
    }

    @PostMapping("/items")
    public CartResponseDTO addItem(@RequestBody AddToCartRequestDTO request) {
        return cartService.addItem(request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponseDTO updateItemQuantity(
            @PathVariable UUID itemId,
            @RequestBody java.util.Map<String, Integer> body) {
        return cartService.updateItemQuantity(itemId, body.get("quantity"));
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponseDTO removeItem(@PathVariable UUID itemId) {
        return cartService.removeItem(itemId);
    }

    @DeleteMapping
    public void clearCart() {
        cartService.clearCart();
    }
}
