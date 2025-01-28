import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestaoDiaria } from '../model/questao-diaria.model';
import { QuestaoRequestDTO } from '../services/dto/questao-request.dto';
import { QuestaoDiariaService } from '../services/questao-diaria.service';
import { ItemQuestaoDiaria } from '../model/item-questao-diaria.model';
import { log } from 'console';
import { ConstAreaConhecimento } from '../constantes/ConstAreaConhecimento';

@Component({
  selector: 'app-desafio-diario',
  templateUrl: './desafio-diario.component.html',
  styleUrls: ['./desafio-diario.component.scss'],
})
export class DesafioDiarioComponent implements OnInit {
  questaoDiaria?: QuestaoDiaria;
  questionItems?: ItemQuestaoDiaria[];
  areaConhecimento = 'Matemática';
  currentQuestion: number = 0;

  constructor(
    private questaoDiariaService: QuestaoDiariaService,
    private router: Router
  ) { }

  ngOnInit() {
    const questaoDiariaDTO: QuestaoRequestDTO = {
      qtd_questoes_linguagens_codigos: 0,
      qtd_questoes_matematica: 0,
      qtd_questoes_ciencias_natureza: 0,
      qtd_questoes_ciencias_humana: 0,
      qtd_questoes_facil: 0,
      qtd_acertos_facil: 0,
      qtd_questoes_medio: 0,
      qtd_acertos_media: 0,
      qtd_questoes_dificil: 0,
      qtd_acertos_dificil: 0,
    };

    this.questaoDiariaService.resgatarQuestaoUsuario(questaoDiariaDTO).subscribe({
      next: (data) => {
        this.questaoDiaria = data.questaoDiaria;
        this.questionItems = data.itemQuestaoDiariaList;
        this.questionItems = this.questionItems.map(item => ({
          ...item,
          correctItem: false,
        }));

        this.areaConhecimento = ConstAreaConhecimento.getAreaConhecimento(data.questaoDiaria.fkCourseId)
        this.currentQuestion++;
      },
      error: (err) => {
        console.error('Erro ao carregar a questão diária:', err);
      },
    });
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  markItem(index: number): void {
    this.questionItems.forEach((item, i) => {
      item.correctItem = i === index;
    });
  }
}
