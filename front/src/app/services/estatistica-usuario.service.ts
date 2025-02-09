import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EstatisticasUsuarioService {
    private readonly apiUrl = 'http://localhost:8080/api/estatisticas-usuario';

    constructor(private http: HttpClient) { }
}