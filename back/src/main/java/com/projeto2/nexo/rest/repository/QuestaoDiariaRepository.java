package com.projeto2.nexo.rest.repository;

import com.projeto2.nexo.entity.QuestaoDiaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestaoDiariaRepository extends JpaRepository<QuestaoDiaria, Integer>{
    @Query("SELECT q FROM QuestaoDiaria q WHERE q.difficulty = :difficulty AND q.id NOT IN :idsRespondidos")
    List<QuestaoDiaria> findByDifficultyNotInIds(
            @Param("difficulty") Integer difficulty,
            @Param("idsRespondidos") List<Integer> idsRespondidos);

    List<QuestaoDiaria> findByIdIn(List<Integer> integers);
}
