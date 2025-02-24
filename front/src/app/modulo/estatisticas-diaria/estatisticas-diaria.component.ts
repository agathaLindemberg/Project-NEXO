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
  quantidadeQuestaoDiariasRespondidaMatematica: number = 0;
  quantidadeQuestaoDiariasRespondidaLinguagem: number = 0;
  quantidadeQuestaoDiariasRespondidaNatureza: number = 0;
  quantidadeQuestaoDiariasRespondidaHumanas: number = 0;
  quantidadeQuestaoDiariasAcertosMatematica: number = 0;
  quantidadeQuestaoDiariasAcertosLinguagem: number = 0;
  quantidadeQuestaoDiariasAcertosNatureza: number = 0;
  quantidadeQuestaoDiariasAcertosHumanas: number = 0;

  constructor(
    public questaoDiariaService: QuestaoDiariaService,
  ) { }

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    const progressoSalvo = localStorage.getItem('progressoDesafio');
    if (!progressoSalvo) return;

    const progresso = JSON.parse(progressoSalvo);

    // Inicializa as variáveis de contagem
    this.quantidadeQuestaoDiariasRespondidaMatematica = 0;
    this.quantidadeQuestaoDiariasRespondidaLinguagem = 0;
    this.quantidadeQuestaoDiariasRespondidaNatureza = 0;
    this.quantidadeQuestaoDiariasRespondidaHumanas = 0;
    this.quantidadeQuestaoDiariasAcertosMatematica = 0;
    this.quantidadeQuestaoDiariasAcertosLinguagem = 0;
    this.quantidadeQuestaoDiariasAcertosNatureza = 0;
    this.quantidadeQuestaoDiariasAcertosHumanas = 0;

    // Obtém as questões respondidas e acertadas do progresso diário e por área
    const idsQuestoesRespondidas = progresso.progressoDiario.ids_questoes_respondidas;
    const idsQuestoesAcertadas = progresso.progressoDiario.ids_questoes_acertadas;

    const questoesRespondidas$ = this.questaoDiariaService.getByIdIn(idsQuestoesRespondidas);
    const questoesAcertadas$ = this.questaoDiariaService.getByIdIn(idsQuestoesAcertadas);

    forkJoin([questoesRespondidas$, questoesAcertadas$]).subscribe(
      ([questoesRespondidas, questoesAcertadas]) => {
        // Contabiliza as questões respondidas por área
        questoesRespondidas.forEach(element => {
          if (element.fkCourseId == 37) {
            this.quantidadeQuestaoDiariasRespondidaLinguagem++;
          }
          if (element.fkCourseId == 38) {
            this.quantidadeQuestaoDiariasRespondidaMatematica++;
          }
          if (element.fkCourseId == 39) {
            this.quantidadeQuestaoDiariasRespondidaNatureza++;
          }
          if (element.fkCourseId == 40) {
            this.quantidadeQuestaoDiariasRespondidaHumanas++;
          }
        });

        // Contabiliza as questões acertadas por área
        questoesAcertadas.forEach(element => {
          if (element.fkCourseId == 37) {
            this.quantidadeQuestaoDiariasAcertosLinguagem++;
          }
          if (element.fkCourseId == 38) {
            this.quantidadeQuestaoDiariasAcertosMatematica++;
          }
          if (element.fkCourseId == 39) {
            this.quantidadeQuestaoDiariasAcertosNatureza++;
          }
          if (element.fkCourseId == 40) {
            this.quantidadeQuestaoDiariasAcertosHumanas++;
          }
        });

        // Atualiza o gráfico com os dados coletados
        this.atualizarGrafico(progresso);
      },
      (error) => {
        console.error('Erro ao buscar as questões:', error);
      }
    );
  }

  atualizarGrafico(progresso): void {
    // Calcula o percentual de acertos geral
    const totalRespondidas = progresso.progressoDiario.ids_questoes_respondidas.length;
    const totalAcertos = progresso.progressoDiario.ids_questoes_acertadas.length;
    this.percentualAcertos = totalRespondidas > 0
      ? ((totalAcertos / totalRespondidas) * 100).toFixed(0) + "%"
      : "0%";

    // Atualiza o tempo médio e a maior sequência de acertos
    this.tempoMedio = progresso.tempoMedio.toFixed(2);    
    this.acertosSeguidos = progresso.maiorSequenciaAcertos;

    // Inicializa o gráfico
    this.initChart();
  }

  initChart() {
    this.data = {
      type: 'bar',
      labels: ['Matemática', 'Humanas', 'Linguagens', 'Natureza'],
      datasets: [
        {
          label: 'Questões Respondidas',
          data: [
            this.quantidadeQuestaoDiariasRespondidaMatematica,
            this.quantidadeQuestaoDiariasRespondidaHumanas,
            this.quantidadeQuestaoDiariasRespondidaLinguagem,
            this.quantidadeQuestaoDiariasRespondidaNatureza
          ],
          backgroundColor: '#B0BEC5',
          borderWidth: 1
        },
        {
          label: 'Questões Acertadas',
          data: [
            this.quantidadeQuestaoDiariasAcertosMatematica,
            this.quantidadeQuestaoDiariasAcertosHumanas,
            this.quantidadeQuestaoDiariasAcertosLinguagem,
            this.quantidadeQuestaoDiariasAcertosNatureza
          ],
          backgroundColor: [
            '#3179FF',
            '#F7B801',
            '#F33404',
            '#40B600'
          ],
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