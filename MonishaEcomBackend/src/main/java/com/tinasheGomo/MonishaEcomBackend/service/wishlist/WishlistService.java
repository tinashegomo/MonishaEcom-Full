package com.tinasheGomo.MonishaEcomBackend.service.wishlist;

import com.tinasheGomo.MonishaEcomBackend.dto.ims.response.ImsProductDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.wishlist.request.AddToWishlistRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.wishlist.response.WishlistResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.entity.user.CustomerUserEntity;
import com.tinasheGomo.MonishaEcomBackend.entity.wishlist.WishlistEntity;
import com.tinasheGomo.MonishaEcomBackend.exception.DuplicateException;
import com.tinasheGomo.MonishaEcomBackend.exception.NotFoundException;
import com.tinasheGomo.MonishaEcomBackend.mapper.wishlist.WishlistMapper;
import com.tinasheGomo.MonishaEcomBackend.repository.CustomerUserRepository;
import com.tinasheGomo.MonishaEcomBackend.repository.WishlistRepository;
import com.tinasheGomo.MonishaEcomBackend.security.SecurityUtils;
import com.tinasheGomo.MonishaEcomBackend.service.ImsClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CustomerUserRepository customerUserRepository;
    private final ImsClient imsClient;
    private final WishlistMapper wishlistMapper;

    private CustomerUserEntity getCurrentCustomer() {
        return customerUserRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new NotFoundException("Customer not found"));
    }

    public List<WishlistResponseDTO> getWishlist() {
        CustomerUserEntity customer = getCurrentCustomer();
        return wishlistMapper.toResponseList(
                wishlistRepository.findByCustomerUserIdOrderByAddedAtDesc(customer.getEcomUserId())
        );
    }

    @Transactional
    public WishlistResponseDTO addItem(AddToWishlistRequestDTO request) {
        CustomerUserEntity customer = getCurrentCustomer();

        // Check if already in wishlist
        if (wishlistRepository.existsByCustomerUserIdAndImsProductId(customer.getEcomUserId(), request.getImsProductId())) {
            throw new DuplicateException("Product is already in your wishlist");
        }

        // Fetch product info from IMS
        ImsProductDTO product = imsClient.getProductById(request.getImsProductId());
        if (product == null) {
            throw new NotFoundException("Product not found");
        }

        WishlistEntity wishlistItem = new WishlistEntity();
        wishlistItem.setCustomerUserId(customer.getEcomUserId());
        wishlistItem.setImsProductId(request.getImsProductId());
        wishlistItem.setProductName(product.getProductName());
        wishlistItem.setProductPrice(product.getProductPrice());

        WishlistEntity saved = wishlistRepository.save(wishlistItem);
        return wishlistMapper.toResponse(saved);
    }

    @Transactional
    public void removeItem(UUID itemId) {
        CustomerUserEntity customer = getCurrentCustomer();
        WishlistEntity item = wishlistRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Wishlist item not found"));

        if (!item.getCustomerUserId().equals(customer.getEcomUserId())) {
            throw new NotFoundException("Wishlist item not found");
        }

        wishlistRepository.delete(item);
    }
}
