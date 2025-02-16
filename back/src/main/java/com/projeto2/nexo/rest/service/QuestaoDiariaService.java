package com.projeto2.nexo.rest.service;

import com.projeto2.nexo.entity.ItemQuestaoDiaria;
import com.projeto2.nexo.entity.QuestaoDiaria;
import com.projeto2.nexo.external.constant.ConstAreaConhecimento;
import com.projeto2.nexo.external.constant.ConstDificuldade;
import com.projeto2.nexo.external.dto.QuestaoDTO;
import com.projeto2.nexo.external.service.IntegracaoQuestioneService;
import com.projeto2.nexo.rest.dto.QuestaoRequestDTO;
import com.projeto2.nexo.rest.dto.QuestaoResponseDTO;
import com.projeto2.nexo.rest.repository.ItemQuestaoDiariaRepository;
import com.projeto2.nexo.rest.repository.QuestaoDiariaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestaoDiariaService {

    @Autowired
    private QuestaoDiariaRepository repository;
    @Autowired
    private ItemQuestaoDiariaService itemQuestaoDiariaService;
    @Autowired
    private IntegracaoQuestioneService integracaoQuestioneService;
    @Autowired
    private ItemQuestaoDiariaRepository itemQuestaoDiariaRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void resgatarQuestoesDiariasPadrao() {
        processarQuestoesPorDificuldade(ConstDificuldade.FACIL, 14);
        processarQuestoesPorDificuldade(ConstDificuldade.MEDIO, 10);
        processarQuestoesPorDificuldade(ConstDificuldade.DIFICIL, 6);
    }

    private void processarQuestoesPorDificuldade(Integer dificuldade, int quantidadePorArea) {
        List<QuestaoDTO> questoesTotais = new ArrayList<>();
        List<Integer> areasConhecimento = Arrays.asList(
                ConstAreaConhecimento.CIENCIAS_HUMANA,
                ConstAreaConhecimento.LINGUAGENS_CODIGOS,
                ConstAreaConhecimento.MATEMATICA,
                ConstAreaConhecimento.CIENCIAS_NATUREZA
        );

        areasConhecimento.forEach(area ->
                questoesTotais.addAll(
                        integracaoQuestioneService.resgatarQuestoesDiarias(quantidadePorArea, dificuldade, area))
        );

        save(questoesTotais, dificuldade);
    }

    @Transactional
    private void save(List<QuestaoDTO> questoesAPI, Integer dificuldade) {
        for (QuestaoDTO questaoAPI : questoesAPI) {
            QuestaoDiaria questaoDiaria = QuestaoDiaria.builder()
                    .baseText(questaoAPI.getBaseText())
                    .stem(questaoAPI.getStem())
                    .fkCourseId(questaoAPI.getFkCourseId())
                    .year(questaoAPI.getYear())
                    .difficulty(dificuldade)
                    .build();

            repository.save(questaoDiaria);

            if (questaoAPI.getQuestionItems() != null) {
                itemQuestaoDiariaService.save(questaoAPI.getQuestionItems(), questaoDiaria);
            }
        }
    }

    public QuestaoResponseDTO escolherProximaQuestao(QuestaoRequestDTO desempenhoUsuario) {
        List<Integer> idsRespondidos = desempenhoUsuario.getIds_questoes_respondidas();


        List<QuestaoDiaria> questoes = repository.findByDifficultyNotInIds(
                definirDificuldade(desempenhoUsuario),
                idsRespondidos == null ? Collections.singletonList(0) : idsRespondidos
        );

        if (!questoes.isEmpty()) {
            Random rand = new Random();
            QuestaoDiaria questaoEscolhida = questoes.get(rand.nextInt(questoes.size()));
            List<ItemQuestaoDiaria> itens = itemQuestaoDiariaRepository.findByQuestaoDiariaId(questaoEscolhida.getId());

            QuestaoResponseDTO questaoResponseDTO = new QuestaoResponseDTO();
            questaoResponseDTO.setQuestaoDiaria(questaoEscolhida);
            questaoResponseDTO.setItemQuestaoDiariaList(itens);
            return questaoResponseDTO;
        } else {
            throw new IllegalStateException("Não foram encontradas questões.");
        }
    }

    public List<QuestaoDiaria> findByIdIn(List<Integer> ids) {
        return repository.findByIdIn(ids);
    }

    private Integer definirDificuldade(QuestaoRequestDTO desempenhoUsuario) {
        List<Integer> idsRespondidos = desempenhoUsuario.getIds_questoes_respondidas();

        if (idsRespondidos == null || idsRespondidos.size() < 3) {
            return ConstDificuldade.FACIL;
        }

        List<QuestaoDiaria> ultimasQuestoes = findByIdIn(
                idsRespondidos.subList(Math.max(0, idsRespondidos.size() - 3), idsRespondidos.size())
        );

        int qtdFacil = 0, qtdMedio = 0, qtdDificil = 0;
        int acertosFacil = 0, acertosMedio = 0, acertosDificil = 0;

        for (QuestaoDiaria questao : ultimasQuestoes) {
            if (Objects.equals(questao.getDifficulty(), ConstDificuldade.FACIL)) {
                qtdFacil++;
                if (desempenhoUsuario.getQtd_acertos_facil() > 0) acertosFacil++;
            } else if (Objects.equals(questao.getDifficulty(), ConstDificuldade.MEDIO)) {
                qtdMedio++;
                if (desempenhoUsuario.getQtd_acertos_media() > 0) acertosMedio++;
            } else if (Objects.equals(questao.getDifficulty(), ConstDificuldade.DIFICIL)) {
                qtdDificil++;
                if (desempenhoUsuario.getQtd_acertos_dificil() > 0) acertosDificil++;
            }
        }

        if (qtdFacil >= 3 && acertosFacil >= 3) {
            return ConstDificuldade.MEDIO;
        }
        if (qtdMedio >= 2 && acertosMedio >= 2) {
            return ConstDificuldade.DIFICIL;
        }
        if (qtdDificil >= 2 && acertosDificil < 2) {
            return ConstDificuldade.MEDIO;
        }

        return ConstDificuldade.FACIL;
    }

    public QuestaoResponseDTO escolherProximaQuestaoPorArea(QuestaoRequestDTO desempenhoUsuario, Integer area) {
        List<Integer> idsRespondidos = desempenhoUsuario.getIds_questoes_respondidas();

        List<QuestaoDiaria> questoes = repository.findByFkCourseIdNotInIds(
                area, idsRespondidos == null ? Collections.singletonList(0) : idsRespondidos
        );

        if (!questoes.isEmpty()) {
            Random rand = new Random();
            QuestaoDiaria questaoEscolhida = questoes.get(rand.nextInt(questoes.size()));
            List<ItemQuestaoDiaria> itens = itemQuestaoDiariaRepository.findByQuestaoDiariaId(questaoEscolhida.getId());

            QuestaoResponseDTO questaoResponseDTO = new QuestaoResponseDTO();
            questaoResponseDTO.setQuestaoDiaria(questaoEscolhida);
            questaoResponseDTO.setItemQuestaoDiariaList(itens);
            return questaoResponseDTO;
        } else {
            throw new IllegalStateException("Não foram encontradas questões.");
        }

    }
}
