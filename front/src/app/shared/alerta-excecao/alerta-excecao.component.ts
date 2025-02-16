import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alerta-excecao',
  templateUrl: './alerta-excecao.component.html',
  styleUrls: ['./alerta-excecao.component.scss']
})
export class AlertaExcecaoComponent {
  @Input() mensagem: string = '';
  @Input() tipo: 'aviso' | 'erro' | 'confirmacao' = 'aviso';
  visivel: boolean = false;

  mostrar(mensagem: string, tipo: 'aviso' | 'erro' | 'confirmacao' = 'aviso') {
    this.mensagem = mensagem;
    this.tipo = tipo;
    this.visivel = true;

    setTimeout(() => {
      this.fechar();
    }, 4000);
  }

  fechar() {
    this.visivel = false;
  }
}
