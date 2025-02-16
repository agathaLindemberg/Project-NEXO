package com.projeto2.nexo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projeto2.nexo.entity.EstatisticasUsuario;
import com.projeto2.nexo.external.constant.ConstAreaConhecimento;
import com.projeto2.nexo.external.constant.ConstDificuldade;
import com.projeto2.nexo.external.dto.QuestaoDTO;
import com.projeto2.nexo.external.service.IntegracaoQuestioneService;
import com.projeto2.nexo.rest.repository.EstatisticasQuestaoUsuarioRepository;
import com.projeto2.nexo.rest.repository.EstatisticasUsuarioRepository;
import com.projeto2.nexo.rest.repository.ItemQuestaoDiariaRepository;
import com.projeto2.nexo.rest.repository.QuestaoDiariaRepository;
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

        ItemQuestaoDiariaRepository itemQuestaoDiariaRepository = context.getBean(ItemQuestaoDiariaRepository.class);
        itemQuestaoDiariaRepository.deleteAll();

        QuestaoDiariaService questaoDiariaService = context.getBean(QuestaoDiariaService.class);
        QuestaoDiariaRepository questaoDiariaRepository = context.getBean(QuestaoDiariaRepository.class);
        questaoDiariaRepository.deleteAll();

        EstatisticasUsuarioRepository estatisticasUsuarioRepository =
                context.getBean(EstatisticasUsuarioRepository.class);
        estatisticasUsuarioRepository.deleteAll();

        EstatisticasQuestaoUsuarioRepository estatisticasQuestaoUsuarioRepository =
                context.getBean(EstatisticasQuestaoUsuarioRepository.class);
        estatisticasQuestaoUsuarioRepository.deleteAll();

        questaoDiariaService.resgatarQuestoesDiariasPadrao();
    }
}
