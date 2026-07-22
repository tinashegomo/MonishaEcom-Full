package com.tinasheGomo.MonishaEcomBackend.service.order;

import com.tinasheGomo.MonishaEcomBackend.dto.ims.response.ImsOrderDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.order.request.CheckoutRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.order.response.OrderItemResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.order.response.OrderResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.entity.cart.CartEntity;
import com.tinasheGomo.MonishaEcomBackend.entity.cart.CartItemEntity;
import com.tinasheGomo.MonishaEcomBackend.entity.user.CustomerUserEntity;
import com.tinasheGomo.MonishaEcomBackend.enums.PaymentType;
import com.tinasheGomo.MonishaEcomBackend.exception.NotFoundException;
import com.tinasheGomo.MonishaEcomBackend.repository.CartRepository;
import com.tinasheGomo.MonishaEcomBackend.repository.CustomerUserRepository;
import com.tinasheGomo.MonishaEcomBackend.security.SecurityUtils;
import com.tinasheGomo.MonishaEcomBackend.service.ImsClient;
import com.tinasheGomo.MonishaEcomBackend.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerOrderService {

    private final ImsClient imsClient;
    private final CartRepository cartRepository;
    private final CustomerUserRepository customerUserRepository;
    private final CartService cartService;

    private CustomerUserEntity getCurrentCustomer() {
        return customerUserRepository.findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow(() -> new NotFoundException("Customer not found"));
    }

    @Transactional
    public OrderResponseDTO checkout(CheckoutRequestDTO request) {
        CustomerUserEntity customer = getCurrentCustomer();

        // Get cart
        CartEntity cart = cartRepository.findByCustomerUserId(customer.getEcomUserId())
                .orElseThrow(() -> new NotFoundException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new NotFoundException("Cart is empty");
        }

        // Build order items for IMS
        List<Map<String, Object>> orderItems = new ArrayList<>();
        for (CartItemEntity item : cart.getItems()) {
            Map<String, Object> orderItem = new HashMap<>();
            orderItem.put("productId", item.getImsProductId());
            if (item.getImsProductSizeId() != null) {
                orderItem.put("size", item.getSize());
            }
            orderItem.put("quantity", item.getQuantity());
            orderItem.put("customMade", false);
            orderItem.put("measurementsTaken", false);
            orderItems.add(orderItem);
        }

        // Use the paid amount from the request — IMS handles 40% minimum validation
        BigDecimal paidAmount = request.getPaidAmount() != null ? request.getPaidAmount() : BigDecimal.ZERO;

        // Call IMS to create order — pass paymentType through
        ImsOrderDTO imsOrder = imsClient.createOrder(
                customer.getImsCustomerId(),
                orderItems,
                paidAmount,
                request.getPaymentType().name(),
                request.getNotes()
        );

        // Clear cart after successful order
        cartService.clearCart();

        // Convert IMS response to our DTO
        return toOrderResponse(imsOrder);
    }

    public List<OrderResponseDTO> getMyOrders() {
        CustomerUserEntity customer = getCurrentCustomer();
        List<ImsOrderDTO> imsOrders = imsClient.getOrdersByCustomer(customer.getImsCustomerId());

        return imsOrders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    private OrderResponseDTO toOrderResponse(ImsOrderDTO imsOrder) {
        OrderResponseDTO response = new OrderResponseDTO();
        response.setOrderId(imsOrder.getOrderId());
        response.setOrderNumber(imsOrder.getOrderNumber());
        response.setCustomerName(imsOrder.getCustomerName());
        response.setCustomerPhone(imsOrder.getCustomerPhone());
        response.setTotalAmount(imsOrder.getTotalAmount());
        response.setPaidAmount(imsOrder.getPaidAmount());
        response.setBalance(imsOrder.getBalance());
        response.setFullyPaid(imsOrder.getFullyPaid());
        response.setPaymentType(imsOrder.getPaymentType());
        response.setOrderStatus(imsOrder.getOrderStatus());
        response.setNotes(imsOrder.getNotes());
        response.setCreatedAt(imsOrder.getCreatedAt());

        if (imsOrder.getOrderItems() != null) {
            List<OrderItemResponseDTO> items = imsOrder.getOrderItems().stream()
                    .map(imsItem -> {
                        OrderItemResponseDTO item = new OrderItemResponseDTO();
                        item.setOrderItemId(imsItem.getOrderItemId());
                        item.setType(imsItem.getType());
                        item.setVariant(imsItem.getVariant());
                        item.setColor(imsItem.getColor());
                        item.setSize(imsItem.getSize());
                        item.setQuantity(imsItem.getQuantity());
                        item.setUnitPrice(imsItem.getUnitPrice());
                        item.setTotalPrice(imsItem.getTotalPrice());
                        item.setCustomMade(imsItem.getCustomMade());
                        item.setProductId(imsItem.getProductId());
                        item.setBatchId(imsItem.getBatchId());
                        return item;
                    })
                    .collect(Collectors.toList());
            response.setOrderItems(items);
        }

        return response;
    }
}
