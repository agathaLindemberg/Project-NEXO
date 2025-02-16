package com.projeto2.nexo.rest.service;

import com.projeto2.nexo.entity.Usuario;
import com.projeto2.nexo.rest.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.sql.In;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public Usuario save(Usuario usuario) {
        return repository.save(usuario);
    }

    public void deleteById(Integer idUsuario) {
        if (!repository.existsById(idUsuario)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        repository.deleteById(idUsuario);
    }

    public Usuario update(Integer id, Usuario usuarioAtualizado) {
        return repository.findById(id)
                .map(usuario -> {
                    usuarioAtualizado.setId(usuario.getId());
                    return repository.save(usuarioAtualizado);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public Usuario findByEmail(String login) {
        Usuario usuario = repository.findByEmail(login);
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        return usuario;
    }

    public Usuario authenticate(String email, String senha) {
        Usuario usuario = findByEmail(email);
        if (!usuario.getSenha().equals(senha)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
        }

        return usuario;
    }

    public Optional<Usuario> getUsuarioById(Integer id) {
        return repository.findById(id);
    }
}