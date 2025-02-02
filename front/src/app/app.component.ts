import { Component, OnInit } from '@angular/core';
import { Usuario } from './model/usuario.model';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  usuario: Usuario | null = null;
  isExpanded = false;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioObservable().subscribe((user) => {
      this.usuario = user;
    });
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goCadastro() {
    this.router.navigate(['/cadastro']);
  }

  goSobre(): void {
    this.router.navigate(['/sobre']);
  }

  goPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}
