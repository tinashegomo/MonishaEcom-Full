package com.tinasheGomo.MonishaEcomBackend.controller.wishlist;

import com.tinasheGomo.MonishaEcomBackend.dto.wishlist.request.AddToWishlistRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.wishlist.response.WishlistResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.service.wishlist.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaEcom/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<WishlistResponseDTO> getWishlist() {
        return wishlistService.getWishlist();
    }

    @PostMapping("/items")
    public WishlistResponseDTO addItem(@RequestBody AddToWishlistRequestDTO request) {
        return wishlistService.addItem(request);
    }

    @DeleteMapping("/items/{itemId}")
    public void removeItem(@PathVariable UUID itemId) {
        wishlistService.removeItem(itemId);
    }
}
