export interface EstatisticasUsuarioDTO {
    idUsuario: number;
    percentualAcertos: number;
    tempoMedio: number;
    acertosSeguidos: number;

    // Atributos para questões diárias
    quantidadeQuestaoDiariasAcertosMatematica: number;
    quantidadeQuestaoDiariasAcertosHumanas: number;
    quantidadeQuestaoDiariasAcertosLinguagem: number;
    quantidadeQuestaoDiariasAcertosNatureza: number;
    quantidadeQuestaoDiariasRespondidaMatematica: number;
    quantidadeQuestaoDiariasRespondidaHumanas: number;
    quantidadeQuestaoDiariasRespondidaLinguagem: number;
    quantidadeQuestaoDiariasRespondidaNatureza: number;

    // Atributos para questões de áreas
    quantidadeQuestaoAreasAcertosMatematica: number;
    quantidadeQuestaoAreasAcertosHumanas: number;
    quantidadeQuestaoAreasAcertosLinguagem: number;
    quantidadeQuestaoAreasAcertosNatureza: number;
    quantidadeQuestaoAreasRespondidaMatematica: number;
    quantidadeQuestaoAreasRespondidaHumanas: number;
    quantidadeQuestaoAreasRespondidaLinguagem: number;
    quantidadeQuestaoAreasRespondidaNatureza: number;
}
