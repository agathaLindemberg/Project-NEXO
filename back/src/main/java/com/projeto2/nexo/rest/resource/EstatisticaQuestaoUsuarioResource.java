package com.projeto2.nexo.rest.resource;

import com.projeto2.nexo.entity.EstatisticasUsuario;
import com.projeto2.nexo.rest.dto.EstatisticasQuestaoUsuarioRequestDTO;
import com.projeto2.nexo.rest.dto.EstatisticasUsuarioDTO;
import com.projeto2.nexo.rest.service.EstatisticaQuestaoUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.sql.In;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/estatisticas-questao-usuario")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class EstatisticaQuestaoUsuarioResource {

    @Autowired
    private EstatisticaQuestaoUsuarioService estatisticasService;

    @PostMapping("/salvar-progresso")
    public ResponseEntity<Void> salvarProgresso(
            @RequestBody EstatisticasQuestaoUsuarioRequestDTO estatisticasQuestaoUsuarioRequestDTO) {
        estatisticasService.salvarProgresso(estatisticasQuestaoUsuarioRequestDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/por-data")
    public ResponseEntity<EstatisticasUsuarioDTO> getEstatisticasPorData(
            @RequestParam String data) {
        EstatisticasUsuarioDTO estatisticas = estatisticasService.getEstatisticasPorData(data);
        return ResponseEntity.ok(estatisticas);
    }

    @GetMapping("/ultimo-dia")
    public ResponseEntity<Map<String, String>> getUltimoDiaComEstatisticas(@RequestParam Integer idUsuario) {
        String ultimaData = estatisticasService.getUltimoDiaComEstatisticas(idUsuario);

        Map<String, String> response = new HashMap<>();
        response.put("data", ultimaData);
        return ResponseEntity.ok(response);
    }
}