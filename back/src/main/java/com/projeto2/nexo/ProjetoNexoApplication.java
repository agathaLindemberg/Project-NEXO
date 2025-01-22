package com.projeto2.nexo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projeto2.nexo.external.constant.ConstAreaConhecimento;
import com.projeto2.nexo.external.constant.ConstDificuldade;
import com.projeto2.nexo.external.dto.QuestaoDTO;
import com.projeto2.nexo.external.service.IntegracaoQuestioneService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class ProjetoNexoApplication {

    private final IntegracaoQuestioneService integracaoQuestioneService;
    private final ObjectMapper objectMapper;

    public ProjetoNexoApplication(IntegracaoQuestioneService integracaoQuestioneService, ObjectMapper objectMapper) {
        this.integracaoQuestioneService = integracaoQuestioneService;
        this.objectMapper = objectMapper;
    }

    public static void main(String[] args) {
        SpringApplication.run(ProjetoNexoApplication.class, args);
        System.out.println("URL: " + System.getProperty("integracao.questione.url"));

        ObjectMapper objectMapper = new ObjectMapper();
        IntegracaoQuestioneService integracaoQuestioneService = new IntegracaoQuestioneService(objectMapper);

        List<QuestaoDTO> questaoDTO = integracaoQuestioneService.resgatarQuestoesDiarias(
                5, ConstDificuldade.DIFICIL, ConstAreaConhecimento.CIENCIAS_HUMANA);
        System.out.println(questaoDTO);
    }
}

