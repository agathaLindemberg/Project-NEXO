package com.projeto2.nexo.rest.dto;

import lombok.*;

import java.util.List;

@Setter
@Getter
public class QuestaoRequestDTO {
    private List<Integer> ids_questoes_respondidas;
    private int qtd_acertos_facil;
    private int qtd_acertos_media;
    private int qtd_acertos_dificil;
}
