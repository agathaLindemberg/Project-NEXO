package com.projeto2.nexo.rest.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {
    public String email;
    public String senha;
}
