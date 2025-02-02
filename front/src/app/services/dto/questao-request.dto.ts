export interface QuestaoRequestDTO {
    ids_questoes_respondidas: number[];
    ids_questoes_acertadas: number[];
    qtd_acertos_facil: number;
    qtd_acertos_media: number;
    qtd_acertos_dificil: number;
}