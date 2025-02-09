import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestaoDiaria } from '../../model/questao-diaria.model';
import { QuestaoRequestDTO } from '../../services/dto/questao-request.dto';
import { QuestaoDiariaService } from '../../services/questao-diaria.service';
import { ItemQuestaoDiaria } from '../../model/item-questao-diaria.model';
import { ConstAreaConhecimento } from '../../constantes/ConstAreaConhecimento';
import { ConstDificuldade } from '../../constantes/ConstDificuldade';
import { Usuario } from '../../model/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { EstatisticasQuestaoUsuarioService } from 'src/app/services/estatistica-questao-usuario.service';
import { EstatisticasQuestaoUsuarioRequestDTO } from 'src/app/services/dto/estatistica-questao-usuario-request.dto';

@Component({
  selector: 'app-desafio-diario',
  templateUrl: './desafio-diario.component.html',
  styleUrls: ['./desafio-diario.component.scss'],
})
export class DesafioDiarioComponent implements OnInit {
  questaoDiaria?: QuestaoDiaria;
  questionItems?: ItemQuestaoDiaria[];
  areaConhecimento = '';
  currentQuestion: number = 0;
  idItemSelecionado: number = 0;
  usuario: Usuario = null;
  tempoInicioQuestao: number = 0;
  tempoPorQuestao: number[] = [];
  respostaConfirmada: boolean = false;
  acertou: boolean = false;
  sequenciaAtualAcertos: number = 0;
  maiorSequenciaAcertos: number = 0;
  escolhaAreaConhecimento: number = 0;

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
    private estatisticaQuestaoUsuarioService: EstatisticasQuestaoUsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const areaSelecionada = params['area'];
      if (areaSelecionada) {
        this.escolhaAreaConhecimento = +areaSelecionada;
      }
    });

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

  confirmarResposta(): void {
    if (!this.questionItems) return;

    const selectedItem: ItemQuestaoDiaria = this.questionItems.find(item => item.correctItem === true);

    if (this.idItemSelecionado === 0) {
      alert('Selecione uma opção antes de confirmar!');
      return;
    }

    this.acertou = selectedItem.id === this.idItemSelecionado;
    if (this.acertou) {
      this.questaoDiariaDTO.ids_questoes_acertadas.push(this.questaoDiaria.id);
      this.sequenciaAtualAcertos++;
      this.maiorSequenciaAcertos = Math.max(this.maiorSequenciaAcertos, this.sequenciaAtualAcertos);

      this.usuario.qtd_moedas += 2;
      this.usuarioService.update(this.usuario).subscribe(() => {
        this.usuarioService.setUsuario(this.usuario);
      });
    } else {
      this.sequenciaAtualAcertos = 0;

      this.usuario.qtd_moedas++;
      this.usuarioService.update(this.usuario).subscribe(() => {
        this.usuarioService.setUsuario(this.usuario);
      });
    }


    if (this.questaoDiaria) {
      switch (this.questaoDiaria.difficulty) {
        case ConstDificuldade.FACIL:
          if (this.acertou) this.questaoDiariaDTO.qtd_acertos_facil++;
          break;
        case ConstDificuldade.MEDIO:
          if (this.acertou) this.questaoDiariaDTO.qtd_acertos_media++;
          break;
        case ConstDificuldade.DIFICIL:
          if (this.acertou) this.questaoDiariaDTO.qtd_acertos_dificil++;
          break;
      }
    }

    this.questaoDiariaDTO.ids_questoes_respondidas.push(this.questaoDiaria.id);

    const tempoDecorrido = parseFloat(((Date.now() - this.tempoInicioQuestao) / 1000 / 60).toFixed(2));
    this.tempoPorQuestao.push(tempoDecorrido);    

    this.respostaConfirmada = true;
    this.salvarProgresso();
  }

  proximaQuestao(): void {
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
      finalizado: false,
      sequenciaAtualAcertos: this.sequenciaAtualAcertos,
      maiorSequenciaAcertos: this.maiorSequenciaAcertos
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
      this.sequenciaAtualAcertos = progresso.sequenciaAtualAcertos || 0;
      this.maiorSequenciaAcertos = progresso.maiorSequenciaAcertos || 0;

      if (progresso.ultimaQuestao && progresso.ultimaQuestaoItens) {
        this.questaoDiaria = progresso.ultimaQuestao;
        this.questionItems = progresso.ultimaQuestaoItens;
        this.areaConhecimento = ConstAreaConhecimento.getAreaConhecimento(this.questaoDiaria.fkCourseId);
        return;
      }
    }
  }

  carregarNovaQuestao(): void {
    this.carregarProgresso();
    console.log(this.escolhaAreaConhecimento);


    if (this.questaoDiariaDTO.ids_questoes_respondidas.length >= 10) {
      const progressoSalvo = localStorage.getItem('progressoDesafio');
      if (progressoSalvo) {
        const progresso = JSON.parse(progressoSalvo);

        if (!progresso.finalizado) {
          const estatisticasRequest: EstatisticasQuestaoUsuarioRequestDTO = {
            idUsuario: this.usuario.id,
            numeroQuestoesRespondidas: progresso.numeroQuestoesRespondidas,
            idsQuestoesRespondidas: progresso.ids_questoes_respondidas,
            idsQuestoesAcertadas: progresso.ids_questoes_acertadas,
            tempoMedio: progresso.tempoMedio,
            finalizado: progresso.finalizado,
            sequenciaAtualAcertos: progresso.sequenciaAtualAcertos,
            maiorSequenciaAcertos: progresso.maiorSequenciaAcertos,
          };

          this.estatisticaQuestaoUsuarioService.salvarProgressoUsuario(estatisticasRequest).subscribe({
            next: () => {
              progresso.finalizado = true;
              localStorage.setItem('progressoDesafio', JSON.stringify(progresso));
            },
            error: (err) => {
              console.error('Erro ao salvar progresso no backend:', err);
            },
          });
        }
      }
      this.router.navigate(['/estatisticas-diaria']);
    } else {
      this.respostaConfirmada = false;
      this.selectedIndex = null;
      this.idItemSelecionado = 0;
      this.dicasDesabilitadas = [];

      if (this.escolhaAreaConhecimento != 0) {
        this.questaoDiariaService.resgatarQuestaoUsuarioPorArea(this.questaoDiariaDTO, this.escolhaAreaConhecimento).subscribe({
          next: (data) => {
            if (!data || !data.questaoDiaria || !data.itemQuestaoDiariaList) {
              console.warn('Dados da questão diária estão incompletos ou inválidos.');
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
          },
        });
      } else {
        this.questaoDiariaService.resgatarQuestaoUsuario(this.questaoDiariaDTO).subscribe({
          next: (data) => {
            if (!data || !data.questaoDiaria || !data.itemQuestaoDiariaList) {
              console.warn('Dados da questão diária estão incompletos ou inválidos.');
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
          },
        });
      }
    }
  }


  removerTagsHtml(texto: string): string {
    return texto.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }

  dicasDesabilitadas: number[] = [];

  usarDica(): void {
    if (this.usuario?.qtd_dicas <= 0) {
      alert('Você não tem mais dicas disponíveis!');
      return;
    }

    if (this.dicasDesabilitadas.length >= 2) {
      alert('Você já usou o máximo de dicas permitidas nesta questão!');
      return;
    }

    const itensIncorretos = this.questionItems
      .map((item, index) => ({ item, index }))
      .filter(({ item, index }) => !item.correctItem && !this.dicasDesabilitadas.includes(index));

    if (itensIncorretos.length === 0) {
      alert('Não há mais itens incorretos para excluir!');
      return;
    }

    const itemIncorreto = itensIncorretos[0];
    this.dicasDesabilitadas.push(itemIncorreto.index);

    this.usuario.qtd_dicas--;
    this.usuarioService.update(this.usuario).subscribe(() => {
      localStorage.setUsuario(this.usuario);
    });

    this.salvarProgresso();
  }

  pularQuestao(): void {
    if (this.usuario?.qtd_pulos <= 0) {
      alert('Você não tem mais pulos disponíveis!');
      return;
    }

    if (this.questaoDiaria) {
      this.questaoDiariaDTO.ids_questoes_respondidas.push(this.questaoDiaria.id);
      this.questaoDiariaDTO.ids_questoes_acertadas.push(this.questaoDiaria.id);
      this.sequenciaAtualAcertos++;
      this.maiorSequenciaAcertos = Math.max(this.maiorSequenciaAcertos, this.sequenciaAtualAcertos);

      switch (this.questaoDiaria.difficulty) {
        case ConstDificuldade.FACIL:
          this.questaoDiariaDTO.qtd_acertos_facil++;
          break;
        case ConstDificuldade.MEDIO:
          this.questaoDiariaDTO.qtd_acertos_media++;
          break;
        case ConstDificuldade.DIFICIL:
          this.questaoDiariaDTO.qtd_acertos_dificil++;
          break;
      }
    }

    this.usuario.qtd_pulos--;
    this.usuarioService.update(this.usuario).subscribe(() => {
      localStorage.setUsuario(this.usuario);
    });

    this.salvarProgresso();
    this.carregarNovaQuestao();
  }
}