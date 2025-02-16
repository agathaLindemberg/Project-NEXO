import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerta-excecao',
  templateUrl: './alerta-excecao.component.html',
  styleUrls: ['./alerta-excecao.component.scss']
})
export class AlertaExcecaoComponent {
  @Input() mensagem: string = '';
  visivel: boolean = false;

  mostrar(mensagem: string) {
    this.mensagem = mensagem;
    this.visivel = true;

    setTimeout(() => {
      this.fechar();
    }, 4000);
  }

  fechar() {
    this.visivel = false;
  }
}