package com.projeto2.nexo.rest.resource;

import com.projeto2.nexo.entity.QuestaoDiaria;
import com.projeto2.nexo.entity.Usuario;
import com.projeto2.nexo.rest.dto.LoginRequest;
import com.projeto2.nexo.rest.dto.QuestaoRequestDTO;
import com.projeto2.nexo.rest.dto.QuestaoResponseDTO;
import com.projeto2.nexo.rest.service.QuestaoDiariaService;
import com.projeto2.nexo.rest.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/questao-diaria")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class QuestaoDiariaResource {

    private final QuestaoDiariaService service;

    @PostMapping
    public ResponseEntity<QuestaoResponseDTO> resgatarQuestaoUsuario(@RequestBody QuestaoRequestDTO desempenhoUsuario) {
        QuestaoResponseDTO questaoDiaria = service.escolherProximaQuestao(desempenhoUsuario);
        return ResponseEntity.ok(questaoDiaria);
    }
}