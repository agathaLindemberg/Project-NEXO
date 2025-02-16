import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AlertaExcecaoComponent } from 'src/app/shared/alerta-excecao/alerta-excecao.component';
import { EstatisticasQuestaoUsuarioRequestDTO } from 'src/app/services/dto/estatistica-questao-usuario-request.dto';

/**
 * Componente responsável por gerenciar o desafio diário de questões.
 * Permite ao usuário responder questões, usar dicas, pular questões e verificar seu progresso.
 */
@Component({
  selector: 'app-desafio-diario',
  templateUrl: './desafio-diario.component.html',
  styleUrls: ['./desafio-diario.component.scss'],
})
export class DesafioDiarioComponent implements OnInit {
  areaAtual: number = 0; // Área de conhecimento atual (0 = desafio diário, outros = áreas específicas)
  areasRealizadas: number[] = []; // Lista de áreas já realizadas pelo usuário
  currentQuestion: number = 0; // Número da questão atual
  ultimaQuestao: QuestaoDiaria | null = null; // Última questão carregada
  ultimaQuestaoItens: ItemQuestaoDiaria[] | null = null; // Itens da última questão
  tempoMedio: number; // Tempo médio por questão
  sequenciaAtualAcertos: number = 0; // Sequência atual de acertos
  maiorSequenciaAcertos: number = 0; // Maior sequência de acertos
  finalizado: boolean = false; // Indica se o desafio foi finalizado
  usuario: Usuario | null = null; // Usuário logado
  tempoInicioQuestao: number = 0; // Tempo de início da questão atual
  tempoPorQuestao: number[] = []; // Lista de tempos gastos em cada questão
  respostaConfirmada: boolean = false; // Indica se a resposta foi confirmada
  acertou: boolean = false; // Indica se o usuário acertou a questão
  dicasDesabilitadas: number[] = []; // Índices dos itens desabilitados por dicas
  selectedIndex: number | null = null; // Índice do item selecionado
  idItemSelecionado = 0; // ID do item selecionado

  progressoDiario: QuestaoRequestDTO = {
    ids_questoes_respondidas: [],
    ids_questoes_acertadas: [],
    qtd_acertos_facil: 0,
    qtd_acertos_media: 0,
    qtd_acertos_dificil: 0,
  };

  progressoPorArea: { [key: number]: QuestaoRequestDTO } = {
    [ConstAreaConhecimento.MATEMATICA]: JSON.parse(JSON.stringify(this.progressoDiario)),
    [ConstAreaConhecimento.LINGUAGENS_CODIGOS]: JSON.parse(JSON.stringify(this.progressoDiario)),
    [ConstAreaConhecimento.CIENCIAS_HUMANA]: JSON.parse(JSON.stringify(this.progressoDiario)),
    [ConstAreaConhecimento.CIENCIAS_NATUREZA]: JSON.parse(JSON.stringify(this.progressoDiario)),
  };

  constructor(
    private questaoDiariaService: QuestaoDiariaService,
    private usuarioService: UsuarioService,
    private estatisticaQuestaoUsuarioService: EstatisticasQuestaoUsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  @ViewChild('alerta') alerta!: AlertaExcecaoComponent; // Referência ao componente de alerta

  /**
 * Método executado ao inicializar o componente.
 * Carrega o progresso salvo e verifica se há uma área selecionada na URL.
 */
  ngOnInit() {
    this.carregarProgresso();
    this.usuario = this.usuarioService.getUsuario();

    this.route.queryParams.subscribe(params => {
      const areaSelecionada = params['area'];
      if (areaSelecionada) {
        const area = +areaSelecionada;
        const progressoArea = this.progressoPorArea[area];

        if (this.areasRealizadas.includes(area) && progressoArea?.ids_questoes_respondidas.length < 11) {
          this.areaAtual = area;
        } else {
          this.ultimaQuestao = null;
          this.ultimaQuestaoItens = null;
          this.currentQuestion = 0;
          this.finalizado = false;

          this.areaAtual = area;
          if (!this.areasRealizadas.includes(area)) {
            this.areasRealizadas.push(area);
          }
        }
        this.salvarProgresso();
      }
    });


    if (!this.ultimaQuestao ||
      (this.progressoDiario?.ids_questoes_respondidas?.includes(this.ultimaQuestao?.id)) ||
      (this.areaAtual && this.progressoPorArea?.[this.areaAtual]?.ids_questoes_respondidas?.includes(this.ultimaQuestao?.id))) {
      this.carregarNovaQuestao();
    }
  }

  /**
 * Retorna a letra correspondente ao índice (A, B, C, etc.).
 * @param index - Índice do item.
 * @returns Letra correspondente.
 */
  getLetraItem(index: number): string {
    return String.fromCharCode(65 + index);
  }

  /**
    * Marca um item como selecionado.
    * @param index - Índice do item selecionado.
    */
  selecionarItem(index: number): void {
    if (this.ultimaQuestaoItens) {
      this.idItemSelecionado = this.ultimaQuestaoItens[index].id;
      if (this.selectedIndex !== index) {
        this.selectedIndex = index;
      }
    }
  }

  /**
 * Confirma a resposta selecionada pelo usuário.
 * Atualiza o progresso e verifica se a resposta está correta.
 */
  confirmarResposta(): void {
    if (!this.ultimaQuestaoItens) return;

    const selectedItem: ItemQuestaoDiaria = this.ultimaQuestaoItens.find(item => item.correctItem === true)!;

    if (this.idItemSelecionado === 0) {
      this.alerta.mostrar(`Selecione uma opção antes de confirmar!`, 'aviso');
      return;
    }

    this.acertou = selectedItem.id === this.idItemSelecionado;

    if (this.acertou) {
      if (this.areaAtual) {
        this.progressoPorArea[this.areaAtual] = this.progressoPorArea[this.areaAtual] || {
          ids_questoes_acertadas: [], ids_questoes_respondidas: [], qtd_acertos_facil: 0, qtd_acertos_media: 0, qtd_acertos_dificil: 0
        };

        this.progressoPorArea[this.areaAtual].ids_questoes_acertadas.push(this.ultimaQuestao!.id);
      } else {
        this.progressoDiario.ids_questoes_acertadas = this.progressoDiario.ids_questoes_acertadas || [];
        this.progressoDiario.ids_questoes_acertadas.push(this.ultimaQuestao!.id);

        this.sequenciaAtualAcertos++;
        this.maiorSequenciaAcertos = Math.max(this.maiorSequenciaAcertos, this.sequenciaAtualAcertos);
      }

      if (this.usuario) {
        this.usuario!.qtd_moedas += 2;
        this.usuarioService.update(this.usuario!).subscribe(() => {
          this.usuarioService.setUsuario(this.usuario!);
        });
      }
    } else {
      this.sequenciaAtualAcertos = 0;

      if (this.usuario) {
        this.usuario!.qtd_moedas++;
        this.usuarioService.update(this.usuario!).subscribe(() => {
          this.usuarioService.setUsuario(this.usuario!);
        });
      }
    }

    if (this.ultimaQuestao) {
      switch (this.ultimaQuestao.difficulty) {
        case ConstDificuldade.FACIL:
          if (this.acertou) {
            this.progressoPorArea[this.areaAtual] = this.progressoPorArea[this.areaAtual] || {
              ids_questoes_acertadas: [], ids_questoes_respondidas: [], qtd_acertos_facil: 0, qtd_acertos_media: 0, qtd_acertos_dificil: 0
            };
            this.progressoPorArea[this.areaAtual].qtd_acertos_facil++;
          } else {
            this.progressoDiario.qtd_acertos_facil++;
          }
          break;
        case ConstDificuldade.MEDIO:
          this.progressoPorArea[this.areaAtual] = this.progressoPorArea[this.areaAtual] || {
            ids_questoes_acertadas: [], ids_questoes_respondidas: [], qtd_acertos_facil: 0, qtd_acertos_media: 0, qtd_acertos_dificil: 0
          };
          this.progressoPorArea[this.areaAtual].qtd_acertos_media++;
          break;
        case ConstDificuldade.DIFICIL:
          this.progressoPorArea[this.areaAtual] = this.progressoPorArea[this.areaAtual] || {
            ids_questoes_acertadas: [], ids_questoes_respondidas: [], qtd_acertos_facil: 0, qtd_acertos_media: 0, qtd_acertos_dificil: 0
          };
          this.progressoPorArea[this.areaAtual].qtd_acertos_dificil++;
          break;
      }
    }

    if (this.areaAtual) {
      this.progressoPorArea[this.areaAtual] = this.progressoPorArea[this.areaAtual] || {
        ids_questoes_acertadas: [], ids_questoes_respondidas: [], qtd_acertos_facil: 0, qtd_acertos_media: 0, qtd_acertos_dificil: 0
      };
      this.progressoPorArea[this.areaAtual].ids_questoes_respondidas.push(this.ultimaQuestao!.id);
    } else {
      this.progressoDiario.ids_questoes_respondidas = this.progressoDiario.ids_questoes_respondidas || [];
      this.progressoDiario.ids_questoes_respondidas.push(this.ultimaQuestao!.id);

      const tempoDecorrido = (Date.now() - this.tempoInicioQuestao) / 1000 / 60;
      this.tempoPorQuestao.push(+tempoDecorrido.toFixed(2));
    }

    this.respostaConfirmada = true;
    this.salvarProgresso();
  }

  /**
 * Carrega a próxima questão.
 */
  proximaQuestao(): void {
    this.carregarNovaQuestao();
  }

  /**
  * Salva o progresso atual no localStorage.
  */
  private salvarProgresso(): void {
    const progressoSalvo = {
      areaAtual: this.areaAtual,
      areasRealizadas: this.areasRealizadas,
      currentQuestion: this.currentQuestion,
      ultimaQuestao: this.ultimaQuestao,
      ultimaQuestaoItens: this.ultimaQuestaoItens,
      tempoMedio: this.tempoPorQuestao.length > 0 ?
        this.tempoPorQuestao.reduce((a, b) => a + b, 0) / this.tempoPorQuestao.length :
        this.tempoMedio,
      sequenciaAtualAcertos: this.sequenciaAtualAcertos,
      maiorSequenciaAcertos: this.maiorSequenciaAcertos,
      finalizado: this.finalizado,
      progressoDiario: this.progressoDiario,
      progressoPorArea: this.progressoPorArea,
    };

    localStorage.setItem('progressoDesafio', JSON.stringify(progressoSalvo));
  }

  /**
 * Carrega o progresso salvo do localStorage.
 */
  private carregarProgresso(): void {
    const progressoSalvo = localStorage.getItem('progressoDesafio');
    if (progressoSalvo) {
      const progresso = JSON.parse(progressoSalvo);

      this.areaAtual = progresso.areaAtual || 0;
      this.areasRealizadas = progresso.areasRealizadas || [];
      this.currentQuestion = progresso.currentQuestion || 0;
      this.ultimaQuestao = progresso.ultimaQuestao || null;
      this.ultimaQuestaoItens = progresso.ultimaQuestaoItens || null;
      this.tempoMedio = progresso.tempoMedio || 0;
      this.sequenciaAtualAcertos = progresso.sequenciaAtualAcertos || 0;
      this.maiorSequenciaAcertos = progresso.maiorSequenciaAcertos || 0;
      this.finalizado = progresso.finalizado || false;

      this.progressoDiario = progresso.progressoDiario || {
        ids_questoes_respondidas: [],
        ids_questoes_acertadas: [],
        qtd_acertos_facil: 0,
        qtd_acertos_media: 0,
        qtd_acertos_dificil: 0,
      };

      this.progressoPorArea = progresso.progressoPorArea || {
        [ConstAreaConhecimento.MATEMATICA]: { ...this.progressoDiario },
        [ConstAreaConhecimento.LINGUAGENS_CODIGOS]: { ...this.progressoDiario },
        [ConstAreaConhecimento.CIENCIAS_HUMANA]: { ...this.progressoDiario },
        [ConstAreaConhecimento.CIENCIAS_NATUREZA]: { ...this.progressoDiario },
      };
    }
  }

  /**
 * Carrega uma nova questão para o usuário responder.
 */
  carregarNovaQuestao(): void {
    this.carregarProgresso();

    if (this.currentQuestion >= 10) {
      this.finalizado = true;
      this.areaAtual = 0;
      this.salvarProgresso();

      if (this.usuario) {
        const progressoSalvo = localStorage.getItem('progressoDesafio');
        if (progressoSalvo) {
          const progresso = JSON.parse(progressoSalvo);
          const estatisticasRequest: EstatisticasQuestaoUsuarioRequestDTO = {
            idUsuario: this.usuario.id,
            idsQuestoesRespondidasDiaria: progresso.progressoDiario.ids_questoes_respondidas, // IDs das questões respondidas no desafio diário
            idsQuestoesAcertadasDiaria: progresso.progressoDiario.ids_questoes_acertadas, // IDs das questões acertadas no desafio diário
            idsQuestoesRespondidasPorArea: [
              ...progresso.progressoPorArea[ConstAreaConhecimento.MATEMATICA].ids_questoes_respondidas,
              ...progresso.progressoPorArea[ConstAreaConhecimento.LINGUAGENS_CODIGOS].ids_questoes_respondidas,
              ...progresso.progressoPorArea[ConstAreaConhecimento.CIENCIAS_HUMANA].ids_questoes_respondidas,
              ...progresso.progressoPorArea[ConstAreaConhecimento.CIENCIAS_NATUREZA].ids_questoes_respondidas
            ],
            idsQuestoesAcertadasPorArea: [
              ...progresso.progressoPorArea[ConstAreaConhecimento.MATEMATICA].ids_questoes_acertadas,
              ...progresso.progressoPorArea[ConstAreaConhecimento.LINGUAGENS_CODIGOS].ids_questoes_acertadas,
              ...progresso.progressoPorArea[ConstAreaConhecimento.CIENCIAS_HUMANA].ids_questoes_acertadas,
              ...progresso.progressoPorArea[ConstAreaConhecimento.CIENCIAS_NATUREZA].ids_questoes_acertadas
            ],

            tempoMedio: progresso.tempoMedio,
            sequenciaAtualAcertos: progresso.sequenciaAtualAcertos,
            maiorSequenciaAcertos: progresso.maiorSequenciaAcertos
          };

          this.estatisticaQuestaoUsuarioService.salvarProgressoUsuario(estatisticasRequest).subscribe({
            next: () => {
              this.ultimaQuestao = null;
              this.salvarProgresso();
              this.router.navigate(['/estatisticas-diaria']);
              return;
            },
            error: (err) => {
              console.error('Erro ao salvar progresso no backend:', err);
            },
          });

        }
      } else {
        this.salvarProgresso();
        this.router.navigate(['/estatisticas-diaria']);
      }
      return;
    }

    this.respostaConfirmada = false;
    this.selectedIndex = null;
    this.idItemSelecionado = 0;
    this.dicasDesabilitadas = [];

    if (this.areaAtual != 0) {
      this.questaoDiariaService.resgatarQuestaoUsuarioPorArea(this.progressoPorArea[this.areaAtual], this.areaAtual).subscribe({
        next: (data) => {
          if (!data || !data.questaoDiaria || !data.itemQuestaoDiariaList) {
            console.warn('Dados da questão diária estão incompletos ou inválidos.');
            return;
          }

          this.ultimaQuestao = data.questaoDiaria;
          this.ultimaQuestaoItens = data.itemQuestaoDiariaList.map(item => ({
            ...item,
            description: this.removerTagsHtml(item.description),
          }));
          this.currentQuestion++;

          this.tempoInicioQuestao = Date.now();
          this.salvarProgresso();
        },
        error: (err) => {
          console.error('Erro ao carregar a questão diária:', err);
        },
      });
    } else {
      this.questaoDiariaService.resgatarQuestaoUsuario(this.progressoDiario).subscribe({
        next: (data) => {
          if (!data || !data.questaoDiaria || !data.itemQuestaoDiariaList) {
            console.warn('Dados da questão diária estão incompletos ou inválidos.');
            return;
          }

          this.ultimaQuestao = data.questaoDiaria;
          this.ultimaQuestaoItens = data.itemQuestaoDiariaList.map(item => ({
            ...item,
            description: this.removerTagsHtml(item.description),
          }));
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

  /**
 * Remove tags HTML de um texto.
 * @param texto - Texto com tags HTML.
 * @returns Texto sem tags HTML.
 */
  removerTagsHtml(texto: string): string {
    return texto.replace(/<\/?[^>]+(>|$)/g, "").trim();
  }

  /**
 * Usa uma dica para eliminar uma alternativa incorreta.
 */
  usarDica(): void {
    if (this.usuario?.qtd_dicas <= 0) {
      this.alerta.mostrar(`Você não tem mais dicas disponíveis!`, 'aviso');
      return;
    }

    if (this.dicasDesabilitadas.length >= 2) {
      this.alerta.mostrar(`Você já usou o máximo de dicas permitidas nesta questão!`, 'aviso');
      return;
    }

    const itensIncorretos = this.ultimaQuestaoItens!
      .map((item, index) => ({ item, index }))
      .filter(({ item, index }) => !item.correctItem && !this.dicasDesabilitadas.includes(index));

    if (itensIncorretos.length === 0) {
      this.alerta.mostrar(`Não há mais itens incorretos para excluir!`, 'erro');
      return;
    }

    const itemIncorreto = itensIncorretos[0];
    this.dicasDesabilitadas.push(itemIncorreto.index);

    this.usuario!.qtd_dicas--;
    this.usuarioService.update(this.usuario).subscribe(() => {
      this.usuarioService.setUsuario(this.usuario!);
    });

    this.salvarProgresso();
  }

  /**
 * Pula a questão atual.
 */
  pularQuestao(): void {
    if (this.usuario?.qtd_pulos <= 0) {
      this.alerta.mostrar(`Você não tem mais pulos disponíveis!`, 'aviso');
      return;
    }

    if (this.ultimaQuestao) {
      if (this.areaAtual) {
        this.progressoPorArea[this.areaAtual].ids_questoes_respondidas.push(this.ultimaQuestao.id);
        this.progressoPorArea[this.areaAtual].ids_questoes_acertadas.push(this.ultimaQuestao.id);
      } else {
        this.progressoDiario.ids_questoes_respondidas.push(this.ultimaQuestao.id);
        this.progressoDiario.ids_questoes_acertadas.push(this.ultimaQuestao.id);
      }

      this.sequenciaAtualAcertos++;
      this.maiorSequenciaAcertos = Math.max(this.maiorSequenciaAcertos, this.sequenciaAtualAcertos);

      switch (this.ultimaQuestao.difficulty) {
        case ConstDificuldade.FACIL:
          if (this.areaAtual) {
            this.progressoPorArea[this.areaAtual].qtd_acertos_facil++;
          } else {
            this.progressoDiario.qtd_acertos_facil++;
          }
          break;
        case ConstDificuldade.MEDIO:
          if (this.areaAtual) {
            this.progressoPorArea[this.areaAtual].qtd_acertos_media++;
          } else {
            this.progressoDiario.qtd_acertos_media++;
          }
          break;
        case ConstDificuldade.DIFICIL:
          if (this.areaAtual) {
            this.progressoPorArea[this.areaAtual].qtd_acertos_dificil++;
          } else {
            this.progressoDiario.qtd_acertos_dificil++;
          }
          break;
      }
    }

    this.usuario!.qtd_pulos--;
    this.usuarioService.update(this.usuario).subscribe(() => {
      this.usuarioService.setUsuario(this.usuario!);
    });

    this.salvarProgresso();
    this.carregarNovaQuestao();
  }

  /**
 * Compra uma dica usando moedas.
 * @param event - Evento de clique.
 */
  comprarDica(event: Event) {
    event.stopPropagation();
    if (this.usuario!.qtd_moedas >= 5) {
      this.usuario!.qtd_moedas -= 5;
      this.usuario!.qtd_dicas += 1;
      this.usuarioService.update(this.usuario!).subscribe(() => {
        this.usuarioService.setUsuario(this.usuario!);
        this.alerta.mostrar(`Dica comprada com sucesso!`, 'confirmacao');
      });
    } else {
      this.alerta.mostrar(`Moedas insuficientes para comprar uma dica. Precisa de 5`, 'erro');
    }
  }

  /**
   * Compra um pulo usando moedas.
   * @param event - Evento de clique.
   */
  comprarPulo(event: Event) {
    event.stopPropagation();
    if (this.usuario!.qtd_moedas >= 10) {
      this.usuario!.qtd_moedas -= 10;
      this.usuario!.qtd_pulos += 1;
      this.usuarioService.update(this.usuario).subscribe(() => {
        this.usuarioService.setUsuario(this.usuario!);
        this.alerta.mostrar(`Pulo comprado com sucesso!`, 'confirmacao');
      });
    } else {
      this.alerta.mostrar(`Moedas insuficientes para comprar um pulo. Precisa de 10`, 'erro');
    }
  }

  /**
  * Retorna o nome da área de conhecimento com base no ID.
  * @param fkCourseId - ID da área de conhecimento.
  * @returns Nome da área mais descritiva.
  */
  obterAreaConhecimento(fkCourseId: number): string {
    return ConstAreaConhecimento.getAreaConhecimento(fkCourseId);
  }

  /**
 * Retorna o nome da área de conhecimento com base no ID.
 * @param fkCourseId - ID da área de conhecimento.
 * @returns Nome da área para o topo.
 */
  obterNomeArea(fkCourseId: number): string {
    switch (fkCourseId) {
      case 40: return 'HUMANAS';
      case 37: return 'LINGUAGENS';
      case 38: return 'MATEMÁTICA';
      case 39: return 'NATUREZA';
      default: return '';
    }
  }

  /**
 * Retorna o caminho da imagem da área de conhecimento com base no ID.
 * @param fkCourseId - ID da área de conhecimento.
 * @returns Caminho da imagem.
 */
  obterImagemArea(fkCourseId: number): string {
    switch (fkCourseId) {
      case 40: return 'assets/imagens/icone-area-humanas.png';
      case 37: return 'assets/imagens/icone-area-linguagens.png';
      case 38: return 'assets/imagens/icone-area-matematica.png';
      case 39: return 'assets/imagens/icone-area-natureza.png';
      default: return '';
    }
  }

  /**
 * Retorna o nível de dificuldade com base no valor numérico.
 * @param dificuldade - Valor numérico da dificuldade.
 * @returns Nível de dificuldade (Fácil, Médio, Difícil).
 */
  obterNivelDificuldade(dificuldade: number): string {
    switch (dificuldade) {
      case ConstDificuldade.FACIL: return 'Fácil';
      case ConstDificuldade.MEDIO: return 'Médio';
      case ConstDificuldade.DIFICIL: return 'Difícil';
      default: return 'Desconhecido';
    }
  }
}  
