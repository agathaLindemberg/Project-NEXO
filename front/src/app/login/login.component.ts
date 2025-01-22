import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  onSubmit(loginForm: any) {
    const { login, senha } = loginForm.value;
    this.usuarioService.login(login, senha).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/home']);
        } else {
          alert('Login ou senha inválidos');
        }
      },
      error => {
        alert('Erro ao tentar fazer login');
      }
    );
  }
}
