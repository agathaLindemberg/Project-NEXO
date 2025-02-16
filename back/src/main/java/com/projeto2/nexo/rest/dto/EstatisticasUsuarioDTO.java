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
    private int quantidadeQuestaoDiariasAcertosMatematica;
    private int quantidadeQuestaoDiariasAcertosHumanas;
    private int quantidadeQuestaoDiariasAcertosLinguagem;
    private int quantidadeQuestaoDiariasAcertosNatureza;
    private int quantidadeQuestaoDiariasRespondidaMatematica;
    private int quantidadeQuestaoDiariasRespondidaHumanas;
    private int quantidadeQuestaoDiariasRespondidaLinguagem;
    private int quantidadeQuestaoDiariasRespondidaNatureza;

    private int quantidadeQuestaoAreasAcertosMatematica;
    private int quantidadeQuestaoAreasAcertosHumanas;
    private int quantidadeQuestaoAreasAcertosLinguagem;
    private int quantidadeQuestaoAreasAcertosNatureza;
    private int quantidadeQuestaoAreasRespondidaMatematica;
    private int quantidadeQuestaoAreasRespondidaHumanas;
    private int quantidadeQuestaoAreasRespondidaLinguagem;
    private int quantidadeQuestaoAreasRespondidaNatureza;
}

