import { QuestaoDiaria } from "./questao-diaria.model";

export interface ItemQuestaoDiaria {
    id?: number;
    questaoDiaria: QuestaoDiaria;
    description: string;
    correctItem: boolean;
  }