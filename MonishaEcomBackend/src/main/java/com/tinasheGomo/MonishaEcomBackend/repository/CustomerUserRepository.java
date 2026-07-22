package com.tinasheGomo.MonishaEcomBackend.repository;

import com.tinasheGomo.MonishaEcomBackend.entity.user.CustomerUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerUserRepository extends JpaRepository<CustomerUserEntity, UUID> {

    Optional<CustomerUserEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
