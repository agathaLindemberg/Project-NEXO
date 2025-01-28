package com.projeto2.nexo.rest.service;

import com.projeto2.nexo.entity.ItemQuestaoDiaria;
import com.projeto2.nexo.entity.QuestaoDiaria;
import com.projeto2.nexo.external.constant.ConstAreaConhecimento;
import com.projeto2.nexo.external.constant.ConstDificuldade;
import com.projeto2.nexo.external.dto.ItemQuestaoDTO;
import com.projeto2.nexo.external.dto.QuestaoDTO;
import com.projeto2.nexo.external.service.IntegracaoQuestioneService;
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
public class ItemQuestaoDiariaService {

    @Autowired
    private ItemQuestaoDiariaRepository repository;

    @Transactional
    public void save(List<ItemQuestaoDTO> itensAPI, QuestaoDiaria questaoDiaria) {
        for (ItemQuestaoDTO item : itensAPI) {
            ItemQuestaoDiaria itemQuestaoDiaria = ItemQuestaoDiaria.builder()
                    .description(item.getDescription())
                    .correctItem(item.getCorrectItem().equals(1))
                    .questaoDiaria(questaoDiaria)
                    .build();


            repository.save(itemQuestaoDiaria);
        }
    }
}
