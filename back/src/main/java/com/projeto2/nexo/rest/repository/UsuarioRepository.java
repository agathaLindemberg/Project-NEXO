package com.projeto2.nexo.rest.repository;

import com.projeto2.nexo.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    Usuario findByEmail(String login);
}
