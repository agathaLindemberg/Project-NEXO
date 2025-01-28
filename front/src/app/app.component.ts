import { Component, OnInit } from '@angular/core';
import { Usuario } from './model/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(public router: Router) {}

  ngOnInit(): void {   
    this.getDetailsUsuario();
  }


  getDetailsUsuario() {
    if (this.usuario == null) {
      this.usuario = {
        nome: 'hrhehherh',
        email: 'oii',
        senha: 'teste',
        qtd_moedas: 0,
        qtd_dicas: 0,
        qtd_lixeira: 0,
        qtd_pulos: 0
      };
    }

    this.usuario.qtd_moedas = 2;
  }

}
