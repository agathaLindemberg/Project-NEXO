import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertaExcecaoComponent } from 'src/app/shared/alerta-excecao/alerta-excecao.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('alerta') alerta!: AlertaExcecaoComponent;

  constructor() { }

  ngOnInit(): void {
  }

  mostrarAlertaConfig() {
    this.alerta.mostrar(`Tá em desenvolvimento :x`, 'erro');
  }

  mostrarAlertaPlanos() {
    this.alerta.mostrar(`Tá em desenvolvimento :x`, 'erro');
  }
}
