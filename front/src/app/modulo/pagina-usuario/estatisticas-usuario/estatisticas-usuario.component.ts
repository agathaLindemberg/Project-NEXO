import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EstatisticasUsuario } from 'src/app/model/estatistica-usuario';
import { Usuario } from 'src/app/model/usuario.model';
import { EstatisticasUsuarioDTO } from 'src/app/services/dto/estatistica-usuario.dto';
import { EstatisticasQuestaoUsuarioService } from 'src/app/services/estatistica-questao-usuario.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-estatisticas-usuario',
  templateUrl: './estatisticas-usuario.component.html',
  styleUrls: ['./estatisticas-usuario.component.scss']
})
export class EstatisticasUsuarioComponent implements OnInit {
  dataSelecionada: string;
  mostrarEstatisticas: boolean = false;
  percentualAcertos: string = '0%';
  tempoMedio: string = '0 min';
  acertosSeguidos: number = 0;
  data: any;
  usuario: Usuario | null = null;

  constructor(
    private estatisticasQuestaoUsuarioService: EstatisticasQuestaoUsuarioService,
    private usuarioService: UsuarioService,
    private dataPipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    this.carregarEstatisticasUltimoDia();
  }

  carregarEstatisticasPorData(): void {
    if (!this.dataSelecionada) return;

    this.estatisticasQuestaoUsuarioService.getEstatisticasPorData(this.dataSelecionada).subscribe({
      next: (estatisticas: EstatisticasUsuarioDTO) => {
        if (estatisticas) {
          this.mostrarEstatisticas = true;
          this.atualizarEstatisticas(estatisticas);
        } else {
          this.mostrarEstatisticas = false;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas:', err);
        this.mostrarEstatisticas = false;
      },
    });
  }

  carregarEstatisticasUltimoDia(): void {
    this.estatisticasQuestaoUsuarioService.getUltimoDiaComEstatisticas(this.usuario.id).subscribe({
      next: (res) => {
        if (res) {
          this.dataSelecionada = this.dataPipe.transform(res.data, 'yyyy-MM-dd');          this.carregarEstatisticasPorData();
        } else {
          this.mostrarEstatisticas = false;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar último dia com estatísticas:', err);
        this.mostrarEstatisticas = false;
      },
    });
  }

  atualizarEstatisticas(estatisticas: EstatisticasUsuarioDTO): void {
    this.percentualAcertos = `${estatisticas.percentualAcertos}%`;
    this.tempoMedio = `${estatisticas.tempoMedio} min`;
    this.acertosSeguidos = estatisticas.acertosSeguidos;

    this.data = {
      type: 'bar',
      labels: ['Matemática', 'Humanas', 'Linguagens', 'Natureza'],
      datasets: [
        {
          label: 'Questões Respondidas', data: [
            estatisticas.quantidadeQuestaoRespondidaMatematica,
            estatisticas.quantidadeQuestaoRespondidaHumanas,
            estatisticas.quantidadeQuestaoRespondidaLinguagem,
            estatisticas.quantidadeQuestaoRespondidaNatureza
          ],
          backgroundColor: '#B0BEC5',
          borderWidth: 1
        },
        {
          label: 'Questões Acertadas', data: [
            estatisticas.quantidadeQuestaoAcertosMatematica,
            estatisticas.quantidadeQuestaoAcertosHumanas,
            estatisticas.quantidadeQuestaoAcertosLinguagem,
            estatisticas.quantidadeQuestaoAcertosNatureza
          ],
          backgroundColor: [
            '#3179FF',
            '#F7B801',
            '#F33404',
            '#40B600'],
          borderWidth: 1
        }
      ],
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          }
        }
      }
    };
  }
}