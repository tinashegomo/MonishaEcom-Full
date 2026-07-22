package com.tinasheGomo.MonishaEcomBackend.dto.auth.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponseDTO {

    private String token;
    private UUID customerUserId;
    private String email;
    private String customerName;
    private UUID imsCustomerId;
}
