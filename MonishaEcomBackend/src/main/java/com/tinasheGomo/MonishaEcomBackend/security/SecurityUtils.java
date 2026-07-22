package com.tinasheGomo.MonishaEcomBackend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static Authentication getUserAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static CustomerUser getCurrentUser() {
        return (CustomerUser) getUserAuthentication().getPrincipal();
    }

    public static String getCurrentUserEmail() {
        return getCurrentUser().getUsername();
    }
}
