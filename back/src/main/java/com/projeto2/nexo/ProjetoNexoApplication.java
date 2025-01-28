package com.projeto2.nexo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projeto2.nexo.external.constant.ConstAreaConhecimento;
import com.projeto2.nexo.external.constant.ConstDificuldade;
import com.projeto2.nexo.external.dto.QuestaoDTO;
import com.projeto2.nexo.external.service.IntegracaoQuestioneService;
import com.projeto2.nexo.rest.service.QuestaoDiariaService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.List;

@SpringBootApplication
@EnableScheduling
public class ProjetoNexoApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(ProjetoNexoApplication.class, args);
        QuestaoDiariaService questaoDiariaService = context.getBean(QuestaoDiariaService.class);

        questaoDiariaService.resgatarQuestoesDiariasPadrao();
    }
}
