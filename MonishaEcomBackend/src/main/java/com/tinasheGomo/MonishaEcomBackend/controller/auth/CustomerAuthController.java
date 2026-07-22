package com.tinasheGomo.MonishaEcomBackend.controller.auth;

import com.tinasheGomo.MonishaEcomBackend.dto.auth.response.AuthResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.auth.request.LoginRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.auth.request.RegisterRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.service.auth.CustomerAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/monishaEcom/auth")
@RequiredArgsConstructor
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    @PostMapping("/register")
    public AuthResponseDTO register(@RequestBody @Valid RegisterRequestDTO request) {
        return customerAuthService.register(request);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody @Valid LoginRequestDTO request) {
        return customerAuthService.login(request);
    }
}
