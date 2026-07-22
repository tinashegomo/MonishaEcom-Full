package com.tinasheGomo.MonishaEcomBackend.security;

import com.tinasheGomo.MonishaEcomBackend.entity.user.CustomerUserEntity;
import com.tinasheGomo.MonishaEcomBackend.repository.CustomerUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {

    private final CustomerUserRepository customerUserRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        CustomerUserEntity customerUser = customerUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found with email: " + email));
        return new CustomerUser(customerUser);
    }
}
