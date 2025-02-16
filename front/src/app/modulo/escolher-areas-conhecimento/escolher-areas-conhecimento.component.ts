import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertaExcecaoComponent } from 'src/app/shared/alerta-excecao/alerta-excecao.component';

@Component({
  selector: 'app-escolher-areas-conhecimento',
  templateUrl: './escolher-areas-conhecimento.component.html',
  styleUrls: ['./escolher-areas-conhecimento.component.scss']
})
export class EscolherAreasConhecimentoComponent implements OnInit {
  usuario: Usuario = null;
  areaEmAndamento: number | undefined;
  areasDesabilitadas: Set<number> = new Set();

  @ViewChild('alerta') alerta!: AlertaExcecaoComponent;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    this.verificarAreasBloqueadas();
  }

  selecionarArea(area: number): void {
    if (this.usuario.qtd_moedas < 50) {
      this.alerta.mostrar('Você não possui moedas suficientes para isso... :(');
      return;
    }

    const { bloqueado, areaEmAndamento } = this.verificarProgressoPendente(area);

    if (bloqueado) {
      if (areaEmAndamento !== undefined) {
        this.router.navigate(['/desafio-diario'], {
          queryParams: { area: areaEmAndamento }
        });
      } else {
        this.alerta.mostrar('Você precisa finalizar seus desafios diários atuais antes de iniciar um novo. E esperar o próximo dia para repetir as áreas!');
      }
      return;
    }

    this.usuario.qtd_moedas = this.usuario.qtd_moedas - 50;
    this.usuarioService.update(this.usuario).subscribe(() => {
      this.usuarioService.setUsuario(this.usuario);
    });

    this.router.navigate(['/desafio-diario'], {
      queryParams: { area: area }
    });
  }

  private verificarProgressoPendente(areaSelecionada?: number): { bloqueado: boolean, areaEmAndamento?: number } {
    const dataAtual = new Date().toISOString().split('T')[0];
    const progressoSalvo = JSON.parse(localStorage.getItem('progressoDesafio') || '{}');
  
    let areaEmAndamento: number | undefined;
  
    if (progressoSalvo.progressoPorArea?.[dataAtual]) {
      for (const areaId in progressoSalvo.progressoPorArea[dataAtual]) {
        if (!progressoSalvo.progressoPorArea[dataAtual][areaId].finalizado) {
          areaEmAndamento = +areaId;
          break;
        }
      }
    }
  
    if (areaEmAndamento !== undefined) {
      if (areaSelecionada !== areaEmAndamento) {
        return { bloqueado: true, areaEmAndamento }; 
      }
    }
  
    if (areaSelecionada && progressoSalvo.progressoPorArea?.[dataAtual]?.[areaSelecionada]?.finalizado) {
      return { bloqueado: true };
    }
  
    return { bloqueado: false };
  }

  private verificarAreasBloqueadas(): void {
    const { bloqueado, areaEmAndamento } = this.verificarProgressoPendente();
    if (areaEmAndamento !== undefined) {
      this.areaEmAndamento = areaEmAndamento;
    }
    if (bloqueado) {
      this.areasDesabilitadas.add(this.areaEmAndamento);
    }
  }
}
