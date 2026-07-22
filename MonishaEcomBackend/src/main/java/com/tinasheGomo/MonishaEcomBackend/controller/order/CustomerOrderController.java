package com.tinasheGomo.MonishaEcomBackend.controller.order;

import com.tinasheGomo.MonishaEcomBackend.dto.order.request.CheckoutRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.order.response.OrderResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.service.order.CustomerOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monishaEcom/orders")
@RequiredArgsConstructor
public class CustomerOrderController {

    private final CustomerOrderService customerOrderService;

    @PostMapping("/checkout")
    public OrderResponseDTO checkout(@RequestBody CheckoutRequestDTO request) {
        return customerOrderService.checkout(request);
    }

    @GetMapping("/my-orders")
    public List<OrderResponseDTO> getMyOrders() {
        return customerOrderService.getMyOrders();
    }
}
