import { Component, OnInit } from '@angular/core';
import { QuestaoDiariaService } from '../../services/questao-diaria.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-estatisticas-diaria',
  templateUrl: './estatisticas-diaria.component.html',
  styleUrls: ['./estatisticas-diaria.component.scss']
})
export class EstatisticasDiariaComponent implements OnInit {
  percentualAcertos: string = '0%';
  tempoMedio: string = '0';
  acertosSeguidos: string = '0';
  data: any;
  quantidadeQuestaoRespondidaMatematica: number = 0;
  quantidadeQuestaoRespondidaLinguagem: number = 0;
  quantidadeQuestaoRespondidaNatureza: number = 0;
  quantidadeQuestaoRespondidaHumanas: number = 0;
  quantidadeQuestaoAcertosMatematica: number = 0;
  quantidadeQuestaoAcertosLinguagem: number = 0;
  quantidadeQuestaoAcertosNatureza: number = 0;
  quantidadeQuestaoAcertosHumanas: number = 0;

  constructor(
    public questaoDiariaService: QuestaoDiariaService,
  ) { }

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    const progresso = JSON.parse(localStorage.getItem('progressoDesafio') || '{}');

    this.quantidadeQuestaoRespondidaMatematica = 0;
    this.quantidadeQuestaoRespondidaLinguagem = 0;
    this.quantidadeQuestaoRespondidaNatureza = 0;
    this.quantidadeQuestaoRespondidaHumanas = 0;
    this.quantidadeQuestaoAcertosMatematica = 0;
    this.quantidadeQuestaoAcertosLinguagem = 0;
    this.quantidadeQuestaoAcertosNatureza = 0;
    this.quantidadeQuestaoAcertosHumanas = 0;

    const questoesRespondidas$ = this.questaoDiariaService.getByIdIn(progresso.ids_questoes_respondidas);
    const questoesAcertadas$ = this.questaoDiariaService.getByIdIn(progresso.ids_questoes_acertadas);

    forkJoin([questoesRespondidas$, questoesAcertadas$]).subscribe(
      ([questoesRespondidas, questoesAcertadas]) => {
        questoesRespondidas.forEach(element => {
          if (element.fkCourseId == 37) {
            this.quantidadeQuestaoRespondidaLinguagem++;
          }
          if (element.fkCourseId == 38) {
            this.quantidadeQuestaoRespondidaMatematica++;
          }
          if (element.fkCourseId == 39) {
            this.quantidadeQuestaoRespondidaNatureza++;
          }
          if (element.fkCourseId == 40) {
            this.quantidadeQuestaoRespondidaHumanas++;
          }
        });

        questoesAcertadas.forEach(element => {
          if (element.fkCourseId == 37) {
            this.quantidadeQuestaoAcertosLinguagem++;
          }
          if (element.fkCourseId == 38) {
            this.quantidadeQuestaoAcertosMatematica++;
          }
          if (element.fkCourseId == 39) {
            this.quantidadeQuestaoAcertosNatureza++;
          }
          if (element.fkCourseId == 40) {
            this.quantidadeQuestaoAcertosHumanas++;
          }
        });

        this.atualizarGrafico(progresso);
      },
      (error) => {
        console.error('Erro ao buscar as questões:', error);
      }
    );
  }

  atualizarGrafico(progresso): void {
    this.percentualAcertos = progresso.ids_questoes_acertadas.length > 0
      ? ((progresso.ids_questoes_acertadas.length / progresso.ids_questoes_respondidas.length) * 100).toFixed(0) + "%"
      : "0%";
    this.tempoMedio = progresso.tempoMedio;
    this.acertosSeguidos = progresso.maiorSequenciaAcertos;

    this.initChart()
  }

  initChart() {
    this.data = {
      type: 'bar',
      labels: ['Matemática', 'Humanas', 'Linguagens', 'Natureza'],
      datasets: [
        {
          label: 'Questões Respondidas', data: [
            this.quantidadeQuestaoRespondidaMatematica,
            this.quantidadeQuestaoRespondidaHumanas,
            this.quantidadeQuestaoRespondidaLinguagem,
            this.quantidadeQuestaoRespondidaNatureza
          ],
          backgroundColor: '#B0BEC5',
          borderWidth: 1
        },
        {
          label: 'Questões Acertadas', data: [
            this.quantidadeQuestaoAcertosMatematica,
            this.quantidadeQuestaoAcertosHumanas,
            this.quantidadeQuestaoAcertosLinguagem,
            this.quantidadeQuestaoAcertosNatureza
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