export interface EstatisticasQuestoesUsuario {
  id: number;
  idUsuario: number;
  idEstatisticaUsuario: number;
  idsQuestoesRespondidas: number[];
  idsQuestoesAcertadas: number[];
  dataRealizada: Date;
}