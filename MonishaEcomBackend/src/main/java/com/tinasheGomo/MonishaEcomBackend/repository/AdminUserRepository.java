package com.tinasheGomo.MonishaEcomBackend.repository;

import com.tinasheGomo.MonishaEcomBackend.entity.user.AdminUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUserEntity, UUID> {

    Optional<AdminUserEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
