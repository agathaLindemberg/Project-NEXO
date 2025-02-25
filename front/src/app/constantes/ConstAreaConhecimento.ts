export class ConstAreaConhecimento {
  static LINGUAGENS_CODIGOS: number = 37;
  static MATEMATICA: number = 38;
  static CIENCIAS_NATUREZA: number = 39;
  static CIENCIAS_HUMANA: number = 40;

  public static getAreaConhecimento(fkCourseId: number): string {
    switch (fkCourseId) {
      case 37:
        return 'Prova de Linguagens';
      case 38:
        return 'Prova de Matemática';
      case 39:
        return 'Prova de Ciências da Natureza';
      case 40:
        return 'Prova de Ciências Humanas';
      default:
        return 'Área desconhecida';
    }
  }
}