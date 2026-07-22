package com.tinasheGomo.MonishaEcomBackend.service.cart;

import com.tinasheGomo.MonishaEcomBackend.dto.cart.request.AddToCartRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.cart.response.CartItemResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.cart.response.CartResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.ims.response.ImsProductDTO;
import com.tinasheGomo.MonishaEcomBackend.entity.cart.CartEntity;
import com.tinasheGomo.MonishaEcomBackend.entity.cart.CartItemEntity;
import com.tinasheGomo.MonishaEcomBackend.entity.user.CustomerUserEntity;
import com.tinasheGomo.MonishaEcomBackend.exception.InsufficientStockException;
import com.tinasheGomo.MonishaEcomBackend.exception.NotFoundException;
import com.tinasheGomo.MonishaEcomBackend.mapper.cart.CartMapper;
import com.tinasheGomo.MonishaEcomBackend.repository.CartItemRepository;
import com.tinasheGomo.MonishaEcomBackend.repository.CartRepository;
import com.tinasheGomo.MonishaEcomBackend.repository.CustomerUserRepository;
import com.tinasheGomo.MonishaEcomBackend.security.SecurityUtils;
import com.tinasheGomo.MonishaEcomBackend.service.ImsClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerUserRepository customerUserRepository;
    private final ImsClient imsClient;
    private final CartMapper cartMapper;

    private CustomerUserEntity getCurrentCustomer() {
        return customerUserRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new NotFoundException("Customer not found"));
    }

    private CartEntity getOrCreateCart(CustomerUserEntity customer) {
        return cartRepository.findByCustomerUserId(customer.getEcomUserId())
                .orElseGet(() -> {
                    CartEntity cart = new CartEntity();
                    cart.setCustomerUserId(customer.getEcomUserId());
                    cart.setItems(new ArrayList<>());
                    return cartRepository.save(cart);
                });
    }

    public CartResponseDTO getCart() {
        CustomerUserEntity customer = getCurrentCustomer();
        CartEntity cart = getOrCreateCart(customer);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponseDTO addItem(AddToCartRequestDTO request) {
        CustomerUserEntity customer = getCurrentCustomer();
        CartEntity cart = getOrCreateCart(customer);

        // Fetch product from IMS to validate and get current price
        ImsProductDTO product = imsClient.getProductById(request.getImsProductId());

        if (product == null) {
            throw new NotFoundException("Product not found in IMS");
        }

        // Check stock availability
        if (request.getImsProductSizeId() != null && product.getProductSizes() != null) {
            boolean hasStock = product.getProductSizes().stream()
                    .anyMatch(size -> size.getProductSizeId().equals(request.getImsProductSizeId())
                            && size.getQuantity() >= request.getQuantity());

            if (!hasStock) {
                throw new InsufficientStockException("Insufficient stock for the selected size");
            }
        }

        // Check if item already exists in cart (same product + size)
        CartItemEntity existingItem = cart.getItems().stream()
                .filter(item -> item.getImsProductId().equals(request.getImsProductId())
                        && java.util.Objects.equals(item.getImsProductSizeId(), request.getImsProductSizeId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItemEntity newItem = new CartItemEntity();
            newItem.setCart(cart);
            newItem.setImsProductId(request.getImsProductId());
            newItem.setImsProductSizeId(request.getImsProductSizeId());
            newItem.setProductName(product.getProductName());
            newItem.setUnitPrice(product.getProductPrice());
            newItem.setSize(request.getSize());
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        cart = cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponseDTO updateItemQuantity(UUID itemId, Integer quantity) {
        CustomerUserEntity customer = getCurrentCustomer();
        CartEntity cart = getOrCreateCart(customer);

        CartItemEntity item = cart.getItems().stream()
                .filter(i -> i.getCartItemId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Cart item not found"));

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        cart = cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponseDTO removeItem(UUID itemId) {
        CustomerUserEntity customer = getCurrentCustomer();
        CartEntity cart = getOrCreateCart(customer);

        cart.getItems().removeIf(item -> item.getCartItemId().equals(itemId));
        cartItemRepository.saveAll(cart.getItems());

        cart = cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Transactional
    public void clearCart() {
        CustomerUserEntity customer = getCurrentCustomer();
        CartEntity cart = getOrCreateCart(customer);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartResponseDTO toCartResponse(CartEntity cart) {
        CartResponseDTO response = new CartResponseDTO();
        response.setCartId(cart.getCartId());

        List<CartItemResponseDTO> items = cartMapper.toCartItemDTOList(cart.getItems());

        // Calculate lineTotal for each item (not in mapper — service responsibility)
        for (CartItemResponseDTO item : items) {
            item.setLineTotal(item.getUnitPrice() * item.getQuantity());
        }

        int totalAmount = items.stream()
                .mapToInt(CartItemResponseDTO::getLineTotal)
                .sum();

        response.setItems(items);
        response.setTotalItems(items.size());
        response.setTotalAmount(totalAmount);

        return response;
    }
}
