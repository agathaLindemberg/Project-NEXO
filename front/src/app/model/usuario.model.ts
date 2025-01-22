export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  qtd_moedas: number;
  desafio_completo?: boolean;

  qtd_acertos_matematica?: number;
  qtd_questoes_matematica?: number;
  qtd_acertos_humanas?: number;
  qtd_questoes_humanas?: number;
  qtd_acertos_natureza?: number;
  qtd_questoes_natureza?: number;
  qtd_acertos_linguagens?: number;
  qtd_questoes_linguagens?: number;
}