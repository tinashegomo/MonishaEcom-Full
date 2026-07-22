package com.tinasheGomo.MonishaEcomBackend.config;

import com.tinasheGomo.MonishaEcomBackend.entity.user.AdminUserEntity;
import com.tinasheGomo.MonishaEcomBackend.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
    }

    private void seedAdminUser() {
        String adminEmail = "tinashegomo96@gmail.com";

        if (adminUserRepository.existsByEmail(adminEmail)) {
            log.info("Admin user already exists — skipping seed.");
            return;
        }

        AdminUserEntity admin = new AdminUserEntity();
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode("Tinashe@123"));
        admin.setFullName("Tinashe Gomo");
        admin.setRole("ROLE_ADMIN");

        adminUserRepository.save(admin);

        log.info("====================================================");
        log.info("  Default admin user created successfully!");
        log.info("  Email:    {}", adminEmail);
        log.info("  Password: Tinashe@123");
        log.info("  Role:     ROLE_ADMIN");
        log.info("====================================================");
    }
}
