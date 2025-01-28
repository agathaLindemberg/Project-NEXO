package com.projeto2.nexo.rest.dto;

import com.projeto2.nexo.entity.ItemQuestaoDiaria;
import com.projeto2.nexo.entity.QuestaoDiaria;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class QuestaoResponseDTO {
    private QuestaoDiaria questaoDiaria;
    private List<ItemQuestaoDiaria> itemQuestaoDiariaList;
}
