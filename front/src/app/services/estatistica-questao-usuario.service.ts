import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EstatisticasQuestaoUsuarioRequestDTO } from "./dto/estatistica-questao-usuario-request.dto";
import { EstatisticasUsuarioDTO } from "./dto/estatistica-usuario.dto";

@Injectable({
    providedIn: 'root'
})
export class EstatisticasQuestaoUsuarioService {
    private readonly apiUrl = 'http://localhost:8080/api/estatisticas-questao-usuario';

    constructor(private http: HttpClient) { }

    salvarProgressoUsuario(progresso: EstatisticasQuestaoUsuarioRequestDTO): Observable<void> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<void>(`${this.apiUrl}/salvar-progresso`, progresso, { headers });
    }

    getEstatisticasPorData(data: string): Observable<EstatisticasUsuarioDTO> {
      return this.http.get<EstatisticasUsuarioDTO>(`${this.apiUrl}/por-data?data=${data}`);
    }
  
    getUltimoDiaComEstatisticas(idUsuario: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/ultimo-dia?idUsuario=${idUsuario}`);
    }    
}