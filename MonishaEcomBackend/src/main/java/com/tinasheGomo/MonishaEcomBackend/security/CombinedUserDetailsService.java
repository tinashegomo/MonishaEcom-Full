package com.tinasheGomo.MonishaEcomBackend.security;

import com.tinasheGomo.MonishaEcomBackend.entity.user.AdminUserEntity;
import com.tinasheGomo.MonishaEcomBackend.entity.user.CustomerUserEntity;
import com.tinasheGomo.MonishaEcomBackend.repository.AdminUserRepository;
import com.tinasheGomo.MonishaEcomBackend.repository.CustomerUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CombinedUserDetailsService implements UserDetailsService {

    private final CustomerUserRepository customerUserRepository;
    private final AdminUserRepository adminUserRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check customer table first
        CustomerUserEntity customerUser = customerUserRepository.findByEmail(email).orElse(null);
        if (customerUser != null) {
            return new CustomerUser(customerUser);
        }

        // Then check admin table
        AdminUserEntity adminUser = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new AdminUser(adminUser);
    }
}
