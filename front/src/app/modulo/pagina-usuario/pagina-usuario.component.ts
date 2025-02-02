import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pagina-usuario',
  templateUrl: './pagina-usuario.component.html',
  styleUrls: ['./pagina-usuario.component.scss']
})
export class PaginaUsuarioComponent implements OnInit {
  usuario: Usuario = null;
  currentQuestion: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
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
}
