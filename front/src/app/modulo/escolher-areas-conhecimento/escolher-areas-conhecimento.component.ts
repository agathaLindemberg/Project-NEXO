import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConstAreaConhecimento } from 'src/app/constantes/ConstAreaConhecimento';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertaExcecaoComponent } from 'src/app/shared/alerta-excecao/alerta-excecao.component';

/**
 * Componente responsável por permitir ao usuário escolher uma área de conhecimento
 * para realizar o desafio diário. O usuário pode selecionar entre diferentes áreas,
 * desde que tenha moedas suficientes e cumpra as regras de progresso.
 */
@Component({
  selector: 'app-escolher-areas-conhecimento',
  templateUrl: './escolher-areas-conhecimento.component.html',
  styleUrls: ['./escolher-areas-conhecimento.component.scss']
})
export class EscolherAreasConhecimentoComponent implements OnInit {
  usuario: Usuario = null; // Usuário logado
  areaEmAndamento: number | undefined; // Área que o usuário está realizando atualmente
  areasDesabilitadas: Set<number> = new Set(); // Conjunto de áreas desabilitadas para seleção

  @ViewChild('alerta') alerta!: AlertaExcecaoComponent; // Referência ao componente de alerta

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) { }

  /**
   * Método executado ao inicializar o componente.
   * Carrega o usuário logado.
   */
  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
  }

  /**
   * Método chamado quando o usuário seleciona uma área de conhecimento.
   * Verifica as condições para permitir ou não a seleção da área.
   * 
   * @param area - O ID da área selecionada.
   */
  selecionarArea(area: number): void {
    const progressoSalvo = JSON.parse(localStorage.getItem('progressoDesafio') || '{}');
    progressoSalvo.progressoPorArea = progressoSalvo.progressoPorArea || {};


    const areaAtual = progressoSalvo.areaAtual || 0; // Área atual em andamento
    const areasRealizadas = progressoSalvo.areasRealizadas || []; // Áreas já concluídas
    const questoesRespondidasDiaria = progressoSalvo.progressoDiario?.ids_questoes_respondidas?.length || 0; // Questões respondidas no desafio diário
    const questoesRespondidasArea = progressoSalvo.progressoPorArea?.[areaAtual]?.ids_questoes_respondidas?.length || 0; // Questões respondidas na área atual

    if (questoesRespondidasDiaria == 0) {
      this.alerta.mostrar('Faça os desafios diários primeiro!', 'erro');
      return;
    }


    if(!this.usuario) {
      this.alerta.mostrar('Você precisa estar logado para comprar as áreas do conhecimento... :(', 'erro');
      return;
    }

    // Verifica se o usuário tem moedas suficientes
    if (this.usuario.qtd_moedas < 50) {
      this.alerta.mostrar('Você não possui moedas suficientes para isso... :(', 'erro');
      return;
    }

    // Caso 1: Usuário já iniciou o progressoDiario e não terminou as 10 questões
    if (areaAtual === 0 && questoesRespondidasDiaria > 0 && questoesRespondidasDiaria < 10) {
      this.alerta.mostrar('Você precisa terminar as 10 questões do desafio diário antes de selecionar uma área!', 'erro');
      return;
    }

    // Caso 2: Usuário já iniciou o progressoPorArea e não selecionou a mesma área
    if (areaAtual !== 0 && area !== areaAtual) {
      const areaJaEmAndamento = ConstAreaConhecimento.getAreaConhecimento(areaAtual);
      this.alerta.mostrar(`Você já iniciou o desafio da ${areaJaEmAndamento}. Conclua-o antes de selecionar outra área.`, 'erro');
      return;
    }

    // Caso 3: Usuário já iniciou o progressoPorArea e selecionou a mesma área
    if (areaAtual !== 0 && area === areaAtual) {
      if (questoesRespondidasArea >= 10) {
        const areaJaEmAndamento = ConstAreaConhecimento.getAreaConhecimento(areaAtual);
        this.alerta.mostrar(`Você já completou as 10 questões da ${areaJaEmAndamento}.`, 'aviso');
        this.areasDesabilitadas.add(area);
        return;
      } else {
        // Permite continuar o desafio da mesma área
        this.router.navigate(['/desafio-diario'], { queryParams: { area: area } });
        return;
      }
    }

    // Caso 4: Usuário já completou uma área e quer selecionar outra que ainda não fez
    if (areasRealizadas.includes(area)) {
      const areaJaEmAndamento = ConstAreaConhecimento.getAreaConhecimento(area);
      this.alerta.mostrar(`Você já completou as 10 questões da ${areaJaEmAndamento}.`, 'aviso');
      this.areasDesabilitadas.add(area);
      return;
    }

    // Caso 5: Usuário pode selecionar uma nova área após concluir o desafio diário
    if (areaAtual === 0 && questoesRespondidasDiaria >= 10) {
      // Resetar o progresso da área selecionada
      progressoSalvo.areaAtual = area;
      progressoSalvo.progressoPorArea[area] = {
        ids_questoes_respondidas: [],
        ids_questoes_acertadas: [],
        qtd_acertos_facil: 0,
        qtd_acertos_media: 0,
        qtd_acertos_dificil: 0,
      };
      localStorage.setItem('progressoDesafio', JSON.stringify(progressoSalvo));

      // Deduzir moedas
      this.usuario.qtd_moedas -= 50;
      this.usuarioService.update(this.usuario).subscribe(() => {
        this.usuarioService.setUsuario(this.usuario);
      });

      // Redirecionar para o desafio diário
      this.router.navigate(['/desafio-diario'], { queryParams: { area: area } });
      return;
    }

    // Caso 6: Usuário pode selecionar uma nova área sem restrições
    progressoSalvo.areaAtual = area;
    progressoSalvo.progressoPorArea[area] = {
      ids_questoes_respondidas: [],
      ids_questoes_acertadas: [],
      qtd_acertos_facil: 0,
      qtd_acertos_media: 0,
      qtd_acertos_dificil: 0,
    };
    localStorage.setItem('progressoDesafio', JSON.stringify(progressoSalvo));

    // Deduzir moedas
    this.usuario.qtd_moedas -= 50;
    this.usuarioService.update(this.usuario).subscribe(() => {
      this.usuarioService.setUsuario(this.usuario);
    });

    // Redirecionar para o desafio diário
    this.router.navigate(['/desafio-diario'], { queryParams: { area: area } });
  }
}