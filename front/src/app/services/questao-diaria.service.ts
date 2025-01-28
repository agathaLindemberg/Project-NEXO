import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { QuestaoDiaria } from "../model/questao-diaria.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { QuestaoRequestDTO } from "./dto/questao-request.dto";
import { QuestaoResponseDTO } from "./dto/questao-response.dto";

@Injectable({
    providedIn: 'root'
})
export class QuestaoDiariaService {
    private readonly apiUrl = 'http://localhost:8080/api/questao-diaria';

    constructor(private http: HttpClient) { }

    resgatarQuestaoUsuario(desempenhoUsuario: QuestaoRequestDTO): Observable<QuestaoResponseDTO> {       
        return this.http.post<QuestaoResponseDTO>(`${this.apiUrl}`, desempenhoUsuario);
      }
}