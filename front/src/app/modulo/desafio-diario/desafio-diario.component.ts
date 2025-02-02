import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestaoDiaria } from '../../model/questao-diaria.model';
import { QuestaoRequestDTO } from '../../services/dto/questao-request.dto';
import { QuestaoDiariaService } from '../../services/questao-diaria.service';
import { ItemQuestaoDiaria } from '../../model/item-questao-diaria.model';
import { ConstAreaConhecimento } from '../../constantes/ConstAreaConhecimento';
import { ConstDificuldade } from '../../constantes/ConstDificuldade';
import { Usuario } from '../../model/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

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
  idItemSelecionado: number = 0;
  usuario: Usuario = null;
  tempoInicioQuestao: number = 0;
  tempoPorQuestao: number[] = [];

  questaoDiariaDTO: QuestaoRequestDTO = {
    ids_questoes_respondidas: [],
    ids_questoes_acertadas: [],
    qtd_acertos_facil: 0,
    qtd_acertos_media: 0,
    qtd_acertos_dificil: 0,
  };

  selectedIndex: number | null = null;

  constructor(
    private questaoDiariaService: QuestaoDiariaService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarProgresso();

    if (!this.questaoDiaria || (this.questaoDiariaDTO.ids_questoes_respondidas.includes(this.questaoDiaria.id))) {
      this.carregarNovaQuestao();
    }

    this.usuario = this.usuarioService.getUsuario();
  }


  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  markItem(index: number): void {
    this.idItemSelecionado = this.questionItems[index].id;
    if (this.selectedIndex !== index) {
      this.selectedIndex = index;
    }
  }

  exibirPopup(mensagem: string): void {
    const popup = document.createElement('div');
    popup.textContent = mensagem;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#ffffff';
    popup.style.color = '#000';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';
    popup.style.fontSize = '18px';
    popup.style.textAlign = 'center';

    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
    }, 1500);
  }

  carregarNovaQuestao(): void {
    this.carregarProgresso();

    if (this.questaoDiariaDTO.ids_questoes_respondidas.length === 10) {
      this.exibirPopup('Você já realizou seu desafio diário.');
      this.router.navigate(['/estatisticas-diaria']);
      return;
    }

    this.selectedIndex = null;
    this.questaoDiariaService.resgatarQuestaoUsuario(this.questaoDiariaDTO).subscribe({
      next: (data) => {
        if (!data || !data.questaoDiaria || !data.itemQuestaoDiariaList) {
          console.warn('Dados da questão diária estão incompletos ou inválidos.');
          this.exibirPopup('Não foi possível carregar a questão. Tente novamente.');
          return;
        }

        this.questaoDiaria = data.questaoDiaria;
        this.questionItems = data.itemQuestaoDiariaList.map(item => ({
          ...item,
          description: this.removerTagsHtml(item.description),
        }));
        this.areaConhecimento = ConstAreaConhecimento.getAreaConhecimento(data.questaoDiaria.fkCourseId);
        this.currentQuestion++;

        this.tempoInicioQuestao = Date.now();
        this.salvarProgresso();
      },
      error: (err) => {
        console.error('Erro ao carregar a questão diária:', err);
        this.exibirPopup('Erro ao carregar a questão. Verifique sua conexão e tente novamente.');
      },
    });

  }


  removerTagsHtml(texto: string): string {
    return texto.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }


  confirmarResposta(): void {
    if (!this.questionItems) return;

    const selectedItem: ItemQuestaoDiaria = this.questionItems.find(item => item.correctItem === true);

    if (this.idItemSelecionado === 0) {
      alert('Selecione uma opção antes de confirmar!');
      return;
    }

    let acertou: boolean = false;
    if (selectedItem.id === this.idItemSelecionado) {
      acertou = true
      this.questaoDiariaDTO.ids_questoes_acertadas.push(this.questaoDiaria.id);
    }

    if (this.questaoDiaria) {
      switch (this.questaoDiaria.difficulty) {
        case ConstDificuldade.FACIL:
          if (acertou) this.questaoDiariaDTO.qtd_acertos_facil++;
          break;
        case ConstDificuldade.MEDIO:
          if (acertou) this.questaoDiariaDTO.qtd_acertos_media++;
          break;
        case ConstDificuldade.DIFICIL:
          if (acertou) this.questaoDiariaDTO.qtd_acertos_dificil++;
          break;
      }
    }

    this.questaoDiariaDTO.ids_questoes_respondidas.push(this.questaoDiaria.id);
    
    const tempoDecorrido = (Date.now() - this.tempoInicioQuestao) / 1000;
    this.tempoPorQuestao.push(tempoDecorrido);

    this.exibirPopup(acertou ? 'Parabéns! Você acertou!' : 'Que pena! Você errou!');
    this.salvarProgresso();
    this.carregarNovaQuestao();
  }

  private salvarProgresso(): void {
    const progresso = {
      numeroQuestoesRespondidas: this.questaoDiariaDTO.ids_questoes_respondidas.length,
      ids_questoes_respondidas: this.questaoDiariaDTO.ids_questoes_respondidas,
      ids_questoes_acertadas: this.questaoDiariaDTO.ids_questoes_acertadas,
      currentQuestion: this.currentQuestion,
      ultimaQuestao: this.questaoDiaria,
      ultimaQuestaoItens: this.questionItems,
      tempoMedio: this.tempoPorQuestao.length > 0 ? this.tempoPorQuestao.reduce((a, b) => a + b, 0) / this.tempoPorQuestao.length : 0,
      finalizado: this.questaoDiariaDTO.ids_questoes_respondidas.length >= 10
    };
    localStorage.setItem('progressoDesafio', JSON.stringify(progresso));
  }


  private carregarProgresso(): void {
    const progressoSalvo = localStorage.getItem('progressoDesafio');
    if (progressoSalvo) {
      const progresso = JSON.parse(progressoSalvo);
      this.questaoDiariaDTO.ids_questoes_respondidas = progresso.ids_questoes_respondidas || [];
      this.questaoDiariaDTO.ids_questoes_acertadas = progresso.ids_questoes_acertadas || [];
      this.currentQuestion = progresso.currentQuestion || 0;
      this.tempoPorQuestao = progresso.temposPorQuestao || [];

      if (progresso.ultimaQuestao && progresso.ultimaQuestaoItens) {
        this.questaoDiaria = progresso.ultimaQuestao;
        this.questionItems = progresso.ultimaQuestaoItens;
        this.areaConhecimento = ConstAreaConhecimento.getAreaConhecimento(this.questaoDiaria.fkCourseId);
        return;
      }
    }
  }

}
