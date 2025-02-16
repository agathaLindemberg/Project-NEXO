import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario.model';
import { AlertaExcecaoComponent } from 'src/app/shared/alerta-excecao/alerta-excecao.component';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  @ViewChild('alerta') alerta!: AlertaExcecaoComponent;

  nomeErro: string = '';
  emailErro: string = '';
  isEdicao: boolean = false; // Flag para identificar se está no modo de edição
  usuario: Usuario | null = null; // Usuário atual (para edição)

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute // Para capturar parâmetros da rota
  ) { }

  ngOnInit(): void {
    // Verifica se há um ID na rota (modo edição)
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdicao = true;
      this.carregarUsuario(id);
    }
  }

  carregarUsuario(id: number) {
    this.usuarioService.getUsuarioById(id).subscribe(
      usuario => {
        this.usuario = usuario;
      },
      error => {
        this.alerta.mostrar('Erro ao carregar usuário', 'erro');
      }
    );
  }

  validarNome(nome: string) {
    this.nomeErro = nome.trim().length < 5 || nome.trim().length > 20 ? 'O nome deve ter entre 5 e 20 caracteres.' : '';
  }

  validarEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailErro = emailRegex.test(email) ? '' : 'E-mail inválido.';
  }

  onSubmit(cadastroForm: any) {
    const { nome, email, senha, confirmarSenha } = cadastroForm.value;

    // Verifica se há erro antes de enviar
    if (this.nomeErro || this.emailErro) {
      this.alerta.mostrar(`Preencha os campos corretamente`, 'erro');
      return;
    }

    const usuario: Usuario = {
      id: this.usuario?.id,
      nome: nome,
      email: email,
      senha: this.isEdicao ? this.usuario?.senha : senha,
      qtd_moedas: this.usuario?.qtd_moedas || 0,
      qtd_pulos: this.usuario?.qtd_pulos || 0,
      qtd_dicas: this.usuario?.qtd_dicas || 0
    };
    
    if (this.isEdicao) {
      // Modo de edição: atualiza o usuário
      this.usuarioService.update(usuario).subscribe(
        success => {
          if (success) {
            this.router.navigate(['/perfil']);
          } else {
            this.alerta.mostrar(`Erro ao atualizar perfil`, 'erro');
          }
        },
        error => {
          this.alerta.mostrar(`Erro ao atualizar perfil`, 'erro');
        }
      );
    } else {
      // Modo de cadastro: cria um novo usuário
      if (senha === confirmarSenha) {
        this.usuarioService.save(usuario).subscribe(
          success => {
            if (success) {
              this.router.navigate(['/login']);
            } else {
              this.alerta.mostrar(`Erro ao tentar cadastrar`, 'erro');
            }
          },
          error => {
            this.alerta.mostrar(`Erro ao tentar cadastrar`, 'erro');
          }
        );
      } else {
        this.alerta.mostrar(`As senhas não estão iguais`, 'erro');
      }
    }
  }
}