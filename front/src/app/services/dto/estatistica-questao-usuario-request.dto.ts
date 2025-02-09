export interface EstatisticasQuestaoUsuarioRequestDTO {
    idUsuario: number;
    numeroQuestoesRespondidas: number;
    idsQuestoesRespondidas: number[];
    idsQuestoesAcertadas: number[];
    tempoMedio: number;
    finalizado: boolean;
    sequenciaAtualAcertos: number;
    maiorSequenciaAcertos: number;
}