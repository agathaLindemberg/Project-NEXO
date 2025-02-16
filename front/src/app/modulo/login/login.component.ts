import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { AlertaExcecaoComponent } from 'src/app/shared/alerta-excecao/alerta-excecao.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('alerta') alerta!: AlertaExcecaoComponent;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  onSubmit(loginForm: any) {
    const { email, senha } = loginForm.value;
    this.usuarioService.login(email, senha).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.alerta.mostrar(`Login ou senha inválidos.`, 'erro');
        }
      },
      error => {
        this.alerta.mostrar(`Erro ao tentar fazer login.`, 'erro');
      }
    );
  }
}
