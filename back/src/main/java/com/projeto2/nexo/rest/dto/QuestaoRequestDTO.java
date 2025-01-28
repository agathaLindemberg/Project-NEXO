package com.projeto2.nexo.rest.dto;

import lombok.*;

@Setter
@Getter
public class QuestaoRequestDTO {
    private int qtd_questoes_linguagens_codigos;
    private int qtd_questoes_matematica;
    private int qtd_questoes_ciencias_natureza;
    private int qtd_questoes_ciencias_humana;
    private int qtd_questoes_facil;
    private int qtd_acertos_facil;
    private int qtd_questoes_medio;
    private int qtd_acertos_media;
    private int qtd_questoes_dificil;
    private int qtd_acertos_dificil;
}
