package com.projeto2.nexo.rest.service;

import com.projeto2.nexo.entity.EstatisticasQuestoesUsuario;
import com.projeto2.nexo.entity.EstatisticasUsuario;
import com.projeto2.nexo.entity.QuestaoDiaria;
import com.projeto2.nexo.rest.dto.EstatisticasQuestaoUsuarioRequestDTO;
import com.projeto2.nexo.rest.dto.EstatisticasUsuarioDTO;
import com.projeto2.nexo.rest.repository.EstatisticasQuestaoUsuarioRepository;
import com.projeto2.nexo.rest.repository.EstatisticasUsuarioRepository;
import com.projeto2.nexo.rest.repository.QuestaoDiariaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EstatisticaQuestaoUsuarioService {

    @Autowired
    private EstatisticasQuestaoUsuarioRepository repository;
    @Autowired
    private EstatisticasUsuarioRepository estatisticasUsuarioRepository;
    @Autowired
    private QuestaoDiariaRepository questaoDiariaRepository;

    @Transactional
    public void salvarProgresso(EstatisticasQuestaoUsuarioRequestDTO estatisticasQuestaoUsuarioRequestDTO) {
        if (estatisticasQuestaoUsuarioRequestDTO.getIdUsuario() != null) {
            EstatisticasUsuario estatisticasUsuario = new EstatisticasUsuario();
            estatisticasUsuario.setIdUsuario(estatisticasQuestaoUsuarioRequestDTO.getIdUsuario());
            estatisticasUsuario.setAcertosSeguidos(estatisticasQuestaoUsuarioRequestDTO.getMaiorSequenciaAcertos());
            estatisticasUsuario.setTempoMedio(estatisticasQuestaoUsuarioRequestDTO.getTempoMedio());
            estatisticasUsuario.setPercentualAcertos(
                    estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesRespondidas().isEmpty()
                            ? BigDecimal.ZERO
                            : BigDecimal.valueOf(
                            (double) estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesAcertadas().size() /
                                    estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesRespondidas().size() * 100)
            );
            EstatisticasUsuario estatisticasUsuarioSalvo = estatisticasUsuarioRepository.save(estatisticasUsuario);

            EstatisticasQuestoesUsuario estatisticasQuestoesUsuario = new EstatisticasQuestoesUsuario();
            estatisticasQuestoesUsuario.setIdUsuario(estatisticasQuestaoUsuarioRequestDTO.getIdUsuario());
            estatisticasQuestoesUsuario.setIdEstatisticaUsuario(estatisticasUsuarioSalvo.getId());
            estatisticasQuestoesUsuario.setDataRealizada(new Date());
            estatisticasQuestoesUsuario.setIdsQuestoesRespondidas(estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesRespondidas());
            estatisticasQuestoesUsuario.setIdsQuestoesAcertadas(estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesAcertadas());

            repository.save(estatisticasQuestoesUsuario);
        }
    }

    public EstatisticasUsuarioDTO getEstatisticasPorData(String data) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dataFormatada;
        try {
            dataFormatada = sdf.parse(data);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }


        EstatisticasQuestoesUsuario estatisticasQuestoesUsuario = repository.findByData(dataFormatada);
        if (estatisticasQuestoesUsuario == null) {
            return null;
        }

        Optional<EstatisticasUsuario> estatisticasUsuario = estatisticasUsuarioRepository.findById(estatisticasQuestoesUsuario.getId());
        if (estatisticasUsuario.isEmpty()) {
            return null;
        }

        int quantidadeQuestaoAcertosMatematica = 0;
        int quantidadeQuestaoAcertosHumanas = 0;
        int quantidadeQuestaoAcertosLinguagem = 0;
        int quantidadeQuestaoAcertosNatureza = 0;

        int quantidadeQuestaoRespondidaMatematica = 0;
        int quantidadeQuestaoRespondidaHumanas = 0;
        int quantidadeQuestaoRespondidaLinguagem = 0;
        int quantidadeQuestaoRespondidaNatureza = 0;

        for (Integer idQuestao : estatisticasQuestoesUsuario.getIdsQuestoesRespondidas()) {
            QuestaoDiaria questao = questaoDiariaRepository.findById(idQuestao).orElse(null);
            if (questao != null) {
                switch (questao.getFkCourseId()) {
                    case 38 -> quantidadeQuestaoRespondidaMatematica++;
                    case 40 -> quantidadeQuestaoRespondidaHumanas++;
                    case 37 -> quantidadeQuestaoRespondidaLinguagem++;
                    case 39 -> quantidadeQuestaoRespondidaNatureza++;
                }
            }
        }

        for (Integer idQuestao : estatisticasQuestoesUsuario.getIdsQuestoesAcertadas()) {
            QuestaoDiaria questao = questaoDiariaRepository.findById(idQuestao).orElse(null);
            if (questao != null) {
                switch (questao.getFkCourseId()) {
                    case 38 -> quantidadeQuestaoAcertosMatematica++;
                    case 40 -> quantidadeQuestaoAcertosHumanas++;
                    case 37 -> quantidadeQuestaoAcertosLinguagem++;
                    case 39 -> quantidadeQuestaoAcertosNatureza++;
                }
            }
        }

        EstatisticasUsuarioDTO estatisticasUsuarioDTO = new EstatisticasUsuarioDTO();
        estatisticasUsuarioDTO.setIdUsuario(estatisticasUsuario.get().getIdUsuario());
        estatisticasUsuarioDTO.setPercentualAcertos(estatisticasUsuario.get().getPercentualAcertos());
        estatisticasUsuarioDTO.setTempoMedio(estatisticasUsuario.get().getTempoMedio());
        estatisticasUsuarioDTO.setAcertosSeguidos(estatisticasUsuario.get().getAcertosSeguidos());
        estatisticasUsuarioDTO.setQuantidadeQuestaoAcertosMatematica(quantidadeQuestaoAcertosMatematica);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAcertosHumanas(quantidadeQuestaoAcertosHumanas);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAcertosLinguagem(quantidadeQuestaoAcertosLinguagem);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAcertosNatureza(quantidadeQuestaoAcertosNatureza);
        estatisticasUsuarioDTO.setQuantidadeQuestaoRespondidaMatematica(quantidadeQuestaoRespondidaMatematica);
        estatisticasUsuarioDTO.setQuantidadeQuestaoRespondidaHumanas(quantidadeQuestaoRespondidaHumanas);
        estatisticasUsuarioDTO.setQuantidadeQuestaoRespondidaLinguagem(quantidadeQuestaoRespondidaLinguagem);
        estatisticasUsuarioDTO.setQuantidadeQuestaoRespondidaNatureza(quantidadeQuestaoRespondidaNatureza);

        return estatisticasUsuarioDTO;
    }

    public String getUltimoDiaComEstatisticas(Integer idUsuario) {
        return repository.findUltimaDataComEstatisticas(idUsuario).toString();
    }
}
