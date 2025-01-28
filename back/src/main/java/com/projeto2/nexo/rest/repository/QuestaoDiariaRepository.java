package com.projeto2.nexo.rest.repository;

import com.projeto2.nexo.entity.QuestaoDiaria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestaoDiariaRepository extends JpaRepository<QuestaoDiaria, Integer>{
    List<QuestaoDiaria> findByDifficultyAndFkCourseId(Integer difficulty, Integer fkCourseId);
}
