package com.projeto2.nexo.rest.repository;

import com.projeto2.nexo.entity.ItemQuestaoDiaria;
import com.projeto2.nexo.entity.QuestaoDiaria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemQuestaoDiariaRepository extends JpaRepository<ItemQuestaoDiaria, Integer>{
    List<ItemQuestaoDiaria> findByQuestaoDiariaId (Long id);
}
