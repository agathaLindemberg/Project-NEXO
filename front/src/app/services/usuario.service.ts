import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from 'src/app/model/usuario.model';
import { EstatisticasUsuario } from '../model/estatistica-usuario';
import { EstatisticasUsuarioDTO } from './dto/estatistica-usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = 'http://localhost:8080/api/usuario';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.getUsuarioFromStorage());

  constructor(private http: HttpClient) { }

  save(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario);
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario).pipe(
      map(updatedUsuario => {
        this.setUsuario(updatedUsuario);
        return updatedUsuario;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        this.logout();
      })
    );
  }

  login(email: string, senha: string): Observable<boolean> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, senha }).pipe(
      map(response => {
        if (response) {
          this.setUsuario(response);
          return true;
        }
      }),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.getUsuario() !== null;
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  getUsuarioObservable(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }

  private getUsuarioFromStorage(): Usuario | null {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) as Usuario : null;
  }

  public setUsuario(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }
}