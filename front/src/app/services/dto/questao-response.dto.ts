import { ItemQuestaoDiaria } from "src/app/model/item-questao-diaria.model";
import { QuestaoDiaria } from "src/app/model/questao-diaria.model";

export interface QuestaoResponseDTO {
    questaoDiaria: QuestaoDiaria;
    itemQuestaoDiariaList: ItemQuestaoDiaria[];
}