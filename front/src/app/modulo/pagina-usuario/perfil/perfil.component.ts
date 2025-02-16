import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = null;
  currentQuestion: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    const progresso = JSON.parse(localStorage.getItem('progressoDesafio') || '{}');
    this.currentQuestion = progresso.currentQuestion
  }

  desconectar() {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }

  verEstatisticas() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/perfil'], { queryParams: { aba: 'estatisticas' } });
    });
  }
}
