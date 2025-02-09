export interface EstatisticasUsuarioDTO {
    idUsuario: number;
    percentualAcertos: number;
    tempoMedio: number;
    acertosSeguidos: number;
    quantidadeQuestaoAcertosMatematica: number;
    quantidadeQuestaoAcertosHumanas: number;
    quantidadeQuestaoAcertosLinguagem: number;
    quantidadeQuestaoAcertosNatureza: number;
    quantidadeQuestaoRespondidaMatematica: number;
    quantidadeQuestaoRespondidaHumanas: number;
    quantidadeQuestaoRespondidaLinguagem: number;
    quantidadeQuestaoRespondidaNatureza: number;
}