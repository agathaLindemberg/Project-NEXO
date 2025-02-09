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

    console.log(this.currentQuestion);

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

  comprarDica() {
    if (this.usuario.qtd_moedas >= 5) {
      this.usuario.qtd_moedas -= 5;
      this.usuario.qtd_dicas += 1;
      this.usuarioService.update(this.usuario).subscribe(() => {
        this.usuarioService.setUsuario(this.usuario);
        alert('Dica comprada com sucesso!');
      });
    } else {
      alert('Moedas insuficientes para comprar uma dica.');
    }
  }

  comprarPulo() {
    if (this.usuario.qtd_moedas >= 10) {
      this.usuario.qtd_moedas -= 10;
      this.usuario.qtd_pulos += 1;
      this.usuarioService.update(this.usuario).subscribe(() => {
        this.usuarioService.setUsuario(this.usuario);
        alert('Pulo comprado com sucesso!');
      });
    } else {
      alert('Moedas insuficientes para comprar um pulo.');
    }
  }
}
