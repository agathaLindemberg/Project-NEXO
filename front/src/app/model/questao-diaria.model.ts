import { ItemQuestaoDiaria } from "./item-questao-diaria.model";

export interface QuestaoDiaria {
    id?: number;
    baseText: string;
    stem: string;
    fkCourseId: number;
    year: number;
    difficulty: number;
    questionItems: ItemQuestaoDiaria[];
  }