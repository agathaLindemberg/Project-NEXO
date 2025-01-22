import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from 'src/app/model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) { }

  save(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario)
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario).pipe(
      map(updatedUsuario => {
        localStorage.setItem('usuario', JSON.stringify(updatedUsuario));
        return updatedUsuario;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        localStorage.removeItem('usuario');
      })
    );
  }

  login(login: string, senha: string): Observable<boolean> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { login, senha }).pipe(
      map(response => {
        if (response) {
          localStorage.setItem('usuario', JSON.stringify(response));
          return true;
        } else {
          return false;
        }
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('usuario') !== null;
  }

  getUsuario(): Usuario | null {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) as Usuario : null;
  }
}
