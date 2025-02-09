package com.projeto2.nexo.rest.repository;

import com.projeto2.nexo.entity.EstatisticasQuestoesUsuario;
import com.projeto2.nexo.entity.EstatisticasUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.Optional;

public interface EstatisticasQuestaoUsuarioRepository extends JpaRepository<EstatisticasQuestoesUsuario, Integer>{

    @Query(value = "SELECT * FROM estatisticas_questoes_usuario WHERE data_realizada::DATE = :data", nativeQuery = true)
    EstatisticasQuestoesUsuario findByData(@Param("data") Date data);
    @Query("SELECT MAX(e.dataRealizada) FROM EstatisticasQuestoesUsuario e WHERE e.idUsuario = :idUsuario")
    Date findUltimaDataComEstatisticas(@Param("idUsuario") Integer idUsuario);
}
