package com.tinasheGomo.MonishaEcomBackend.service.auth;

import com.tinasheGomo.MonishaEcomBackend.dto.auth.response.AuthResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.auth.request.LoginRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.auth.request.RegisterRequestDTO;
import com.tinasheGomo.MonishaEcomBackend.dto.ims.response.ImsCustomerDTO;
import com.tinasheGomo.MonishaEcomBackend.entity.user.AdminUserEntity;
import com.tinasheGomo.MonishaEcomBackend.entity.user.CustomerUserEntity;
import com.tinasheGomo.MonishaEcomBackend.exception.DuplicateException;
import com.tinasheGomo.MonishaEcomBackend.repository.AdminUserRepository;
import com.tinasheGomo.MonishaEcomBackend.repository.CustomerUserRepository;
import com.tinasheGomo.MonishaEcomBackend.security.JWTUtils;
import com.tinasheGomo.MonishaEcomBackend.service.ImsClient;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerAuthService {

    private final CustomerUserRepository customerUserRepository;
    private final AdminUserRepository adminUserRepository;
    private final ImsClient imsClient;
    private final JWTUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {

        // Check if email already exists in either table
        if (customerUserRepository.existsByEmail(request.getEmail()) ||
            adminUserRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateException("An account with this email already exists");
        }

        // Create customer in IMS database
        ImsCustomerDTO imsCustomer = imsClient.findOrCreateCustomer(
                request.getName(),
                request.getPhone()
        );

        // Create local customer user account
        CustomerUserEntity customerUser = new CustomerUserEntity();
        customerUser.setEmail(request.getEmail());
        customerUser.setPassword(passwordEncoder.encode(request.getPassword()));
        customerUser.setFullName(request.getName());
        customerUser.setPhone(request.getPhone());
        customerUser.setImsCustomerId(imsCustomer.getCustomerId());

        CustomerUserEntity savedUser = customerUserRepository.save(customerUser);

        // Generate JWT
        String token = jwtUtils.generateToken(savedUser.getEmail());

        return new AuthResponseDTO(
                token,
                savedUser.getEcomUserId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getImsCustomerId()
        );
    }

    public AuthResponseDTO login(LoginRequestDTO request) {

        // Authenticate credentials (works for both customer and admin via CombinedUserDetailsService)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Check customer table first
        CustomerUserEntity customerUser = customerUserRepository.findByEmail(request.getEmail()).orElse(null);
        if (customerUser != null) {
            String token = jwtUtils.generateToken(customerUser.getEmail());
            return new AuthResponseDTO(
                    token,
                    customerUser.getEcomUserId(),
                    customerUser.getEmail(),
                    customerUser.getFullName(),
                    customerUser.getImsCustomerId()
            );
        }

        // Then check admin table
        AdminUserEntity adminUser = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtils.generateToken(adminUser.getEmail());
        return new AuthResponseDTO(
                token,
                adminUser.getAdminUserId(),
                adminUser.getEmail(),
                adminUser.getFullName(),
                null
        );
    }
}
