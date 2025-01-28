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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
        processarQuestoesPorDificuldade(ConstDificuldade.FACIL, 4);
        processarQuestoesPorDificuldade(ConstDificuldade.MEDIO, 3);
        processarQuestoesPorDificuldade(ConstDificuldade.DIFICIL, 3);
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
        int totalQuestoes =
                desempenhoUsuario.getQtd_questoes_linguagens_codigos() +
                        desempenhoUsuario.getQtd_questoes_matematica() +
                        desempenhoUsuario.getQtd_questoes_ciencias_natureza() +
                        desempenhoUsuario.getQtd_questoes_ciencias_humana();

        if (totalQuestoes == 0) {
            List<QuestaoDiaria> questoes = repository.findByDifficultyAndFkCourseId(
                    ConstDificuldade.FACIL, ConstAreaConhecimento.LINGUAGENS_CODIGOS);
            if (!questoes.isEmpty()) {
                List<ItemQuestaoDiaria> itens = itemQuestaoDiariaRepository.findByQuestaoDiariaId(questoes.get(0).getId());
                QuestaoResponseDTO questaoResponseDTO = new QuestaoResponseDTO();
                questaoResponseDTO.setQuestaoDiaria(questoes.get(0));
                questaoResponseDTO.setItemQuestaoDiariaList(itens);
                return questaoResponseDTO;
            }
        }

        if (totalQuestoes < 10) {
            List<QuestaoDiaria> questoes;
            int index = totalQuestoes;

            if (desempenhoUsuario.getQtd_questoes_linguagens_codigos() == 0) {
                questoes = repository.findByDifficultyAndFkCourseId(
                        definirDificuldade(desempenhoUsuario), ConstAreaConhecimento.LINGUAGENS_CODIGOS);
            } else if (desempenhoUsuario.getQtd_questoes_matematica() == 0) {
                questoes = repository.findByDifficultyAndFkCourseId(
                        definirDificuldade(desempenhoUsuario), ConstAreaConhecimento.MATEMATICA);
            } else if (desempenhoUsuario.getQtd_questoes_ciencias_natureza() == 0) {
                questoes = repository.findByDifficultyAndFkCourseId(
                        definirDificuldade(desempenhoUsuario), ConstAreaConhecimento.CIENCIAS_NATUREZA);
            } else if (desempenhoUsuario.getQtd_questoes_ciencias_humana() == 0) {
                questoes = repository.findByDifficultyAndFkCourseId(
                        definirDificuldade(desempenhoUsuario), ConstAreaConhecimento.CIENCIAS_HUMANA);
            } else {
                throw new IllegalStateException("Todas as áreas já possuem questões.");
            }

            if (questoes.isEmpty()) {
                return null;
            } else {
                List<ItemQuestaoDiaria> itens = itemQuestaoDiariaRepository.findByQuestaoDiariaId(
                        questoes.get(Math.min(index, questoes.size() - 1)).getId());
                QuestaoResponseDTO questaoResponseDTO = new QuestaoResponseDTO();
                questaoResponseDTO.setQuestaoDiaria(questoes.get(Math.min(index, questoes.size() - 1)));
                questaoResponseDTO.setItemQuestaoDiariaList(itens);
                return questaoResponseDTO;
            }
        }

        throw new IllegalStateException("Todas as áreas já possuem questões.");
    }


    private Integer definirDificuldade(QuestaoRequestDTO desempenhoUsuario) {
        if (desempenhoUsuario.getQtd_questoes_facil() >= 3 &&
                desempenhoUsuario.getQtd_acertos_facil() >= 3) {
            return ConstDificuldade.MEDIO;
        }

        if (desempenhoUsuario.getQtd_questoes_medio() >= 2 &&
                desempenhoUsuario.getQtd_acertos_media() >= 2) {
            return ConstDificuldade.DIFICIL;
        } else if (desempenhoUsuario.getQtd_questoes_medio() >= 2) {
            return ConstDificuldade.FACIL;
        }

        if (desempenhoUsuario.getQtd_questoes_dificil() >= 2 &&
                desempenhoUsuario.getQtd_acertos_dificil() < 2) {
            return ConstDificuldade.MEDIO;
        }

        return ConstDificuldade.FACIL;
    }
}
