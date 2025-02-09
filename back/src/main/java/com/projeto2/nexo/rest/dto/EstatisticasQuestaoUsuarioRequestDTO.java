package com.projeto2.nexo.rest.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
public class EstatisticasQuestaoUsuarioRequestDTO {
    private Integer idUsuario;
    private Integer numeroQuestoesRespondidas;
    private List<Integer> idsQuestoesRespondidas;
    private List<Integer> idsQuestoesAcertadas;
    private BigDecimal tempoMedio;
    private boolean finalizado;
    private Integer sequenciaAtualAcertos;
    private Integer maiorSequenciaAcertos;

}
