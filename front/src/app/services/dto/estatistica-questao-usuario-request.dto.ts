export interface EstatisticasQuestaoUsuarioRequestDTO {
    idUsuario: number;
    idsQuestoesRespondidasDiaria: number[]; // IDs das questões respondidas no desafio diário
    idsQuestoesAcertadasDiaria: number[]; // IDs das questões acertadas no desafio diário
    idsQuestoesRespondidasPorArea: number[]; // IDs das questões respondidas por área (concatenar todos)
    idsQuestoesAcertadasPorArea: number[]; // IDs das questões acertadas por área (concatenar todos)
    
    tempoMedio: number; // Tempo médio
    sequenciaAtualAcertos: number; // Sequência atual de acertos
    maiorSequenciaAcertos: number; // Maior sequência de acertos
}
