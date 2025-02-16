package com.projeto2.nexo.rest.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
public class EstatisticasQuestaoUsuarioRequestDTO {
    private Integer idUsuario;
    private List<Integer> idsQuestoesRespondidasDiaria;
    private List<Integer> idsQuestoesAcertadasDiaria;
    private List<Integer> idsQuestoesRespondidasPorArea;
    private List<Integer> idsQuestoesAcertadasPorArea;

    private BigDecimal tempoMedio;
    private Integer sequenciaAtualAcertos;
    private Integer maiorSequenciaAcertos;
}
