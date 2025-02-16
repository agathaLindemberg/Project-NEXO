import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { QuestaoDiaria } from "../model/questao-diaria.model";
import { Observable } from "rxjs";
import { QuestaoRequestDTO } from "./dto/questao-request.dto";
import { QuestaoResponseDTO } from "./dto/questao-response.dto";

@Injectable({
    providedIn: 'root'
})
export class QuestaoDiariaService {
    private readonly apiUrl = 'http://localhost:8080/api/questao-diaria';

    constructor(private http: HttpClient) { }

    resgatarQuestaoUsuarioPorArea(desempenhoUsuario: QuestaoRequestDTO, area: number): Observable<QuestaoResponseDTO> {
        return this.http.post<QuestaoResponseDTO>(`${this.apiUrl}/area?area=${area}`, desempenhoUsuario);
      }
      
    resgatarQuestaoUsuario(desempenhoUsuario: QuestaoRequestDTO): Observable<QuestaoResponseDTO> {
        return this.http.post<QuestaoResponseDTO>(`${this.apiUrl}`, desempenhoUsuario);
    }

    getByIdIn(ids: number[]): Observable<QuestaoDiaria[]> {
        return this.http.get<QuestaoDiaria[]>(`${this.apiUrl}/listar?ids=${ids.join(',')}`);
    }
}