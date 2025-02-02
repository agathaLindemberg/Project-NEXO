import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  onSubmit(cadastroForm: any) {
    const { nome, email, senha, confirmarSenha } = cadastroForm.value;
    const usuario: Usuario = { nome, email, senha, qtd_moedas: 0, qtd_pulos: 0 , qtd_lixeira: 0 , qtd_dicas: 0 };

    if (senha == confirmarSenha) {
      this.usuarioService.save(usuario).subscribe(
        success => {
          if (success) {
            this.router.navigate(['/login']);
          } else {
            alert('Erro ao tentar cadastrar');
          }
        },
        error => {
          alert('Erro ao tentar cadastrar');
        }
      );
    } else {
      alert('AS senhas não estão iguais');
    }
  }
}
