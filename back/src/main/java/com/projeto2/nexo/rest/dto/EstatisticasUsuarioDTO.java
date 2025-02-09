package com.projeto2.nexo.rest.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class EstatisticasUsuarioDTO {
    private Integer idUsuario;
    private BigDecimal percentualAcertos;
    private BigDecimal tempoMedio;
    private int acertosSeguidos;
    private int quantidadeQuestaoAcertosMatematica;
    private int quantidadeQuestaoAcertosHumanas;
    private int quantidadeQuestaoAcertosLinguagem;
    private int quantidadeQuestaoAcertosNatureza;
    private int quantidadeQuestaoRespondidaMatematica;
    private int quantidadeQuestaoRespondidaHumanas;
    private int quantidadeQuestaoRespondidaLinguagem;
    private int quantidadeQuestaoRespondidaNatureza;
}

