import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pagina-usuario',
  templateUrl: './pagina-usuario.component.html',
  styleUrls: ['./pagina-usuario.component.scss']
})
export class PaginaUsuarioComponent implements OnInit {
  usuario: Usuario = null;
  abaAtiva: string = 'perfil';  // Controle da aba ativa
  currentQuestion: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    const progresso = JSON.parse(localStorage.getItem('progressoDesafio') || '{}');
    this.currentQuestion = progresso.currentQuestion;

    this.route.queryParams.subscribe(params => {
      const aba = params['aba'];
      if (aba === 'estatisticas') {
        this.abaAtiva = 'estatisticas';
      } else {
        this.abaAtiva = 'perfil';
      }
    });
  }

  mostrarPerfil() {
    this.abaAtiva = 'perfil';
  }

  mostrarEstatisticas() {
    this.abaAtiva = 'estatisticas';
  }

  desconectar() {
    this.usuarioService.logout();
    this.router.navigate(['/']);
  }
}