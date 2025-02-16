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

            // Verificar se já existe um registro de EstatisticasQuestoesUsuario para o usuário na data atual
            EstatisticasQuestoesUsuario estatisticasQuestoesUsuario = repository
                    .findByIdUsuarioAndDataRealizada(estatisticasQuestaoUsuarioRequestDTO.getIdUsuario(), new Date());

            if (estatisticasQuestoesUsuario == null) {
                // Verificar se já existe uma EstatisticaUsuario para o usuário
                EstatisticasUsuario estatisticasUsuario = estatisticasUsuarioRepository.findByIdUsuario(
                        estatisticasQuestaoUsuarioRequestDTO.getIdUsuario());

                if (estatisticasUsuario == null) {
                    // Se não existir, cria um novo objeto EstatisticasUsuario
                    estatisticasUsuario = new EstatisticasUsuario();
                    estatisticasUsuario.setIdUsuario(estatisticasQuestaoUsuarioRequestDTO.getIdUsuario());
                }

                // Atualiza os dados da EstatisticasUsuario
                estatisticasUsuario.setAcertosSeguidos(estatisticasQuestaoUsuarioRequestDTO.getMaiorSequenciaAcertos());
                estatisticasUsuario.setTempoMedio(estatisticasQuestaoUsuarioRequestDTO.getTempoMedio());

                estatisticasUsuario.setPercentualAcertos(
                        estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesRespondidasDiaria().isEmpty()
                                ? BigDecimal.ZERO
                                : BigDecimal.valueOf(
                                (double) estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesAcertadasDiaria().size() /
                                        estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesRespondidasDiaria().size() * 100)
                );

                // Salvar ou atualizar a estatística do usuário
                estatisticasUsuario = estatisticasUsuarioRepository.save(estatisticasUsuario);

                // Se não existir, cria um novo objeto EstatisticasQuestoesUsuario
                estatisticasQuestoesUsuario = new EstatisticasQuestoesUsuario();
                estatisticasQuestoesUsuario.setIdUsuario(estatisticasQuestaoUsuarioRequestDTO.getIdUsuario());
                estatisticasQuestoesUsuario.setIdEstatisticaUsuario(estatisticasUsuario.getId());
                estatisticasQuestoesUsuario.setDataRealizada(new Date());
            }

            // Atualiza os dados de EstatisticasQuestoesUsuario
            estatisticasQuestoesUsuario.setIdsQuestoesRespondidasDiaria(
                    estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesRespondidasDiaria());
            estatisticasQuestoesUsuario.setIdsQuestoesAcertadasDiaria(
                    estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesAcertadasDiaria());
            estatisticasQuestoesUsuario.setIdsQuestoesRespondidasPorArea(
                    estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesRespondidasPorArea());
            estatisticasQuestoesUsuario.setIdsQuestoesAcertadasPorArea(
                    estatisticasQuestaoUsuarioRequestDTO.getIdsQuestoesAcertadasPorArea());

            // Salvar ou atualizar a estatística das questões do usuário
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

        Optional<EstatisticasUsuario> estatisticasUsuario = estatisticasUsuarioRepository.findById(
                estatisticasQuestoesUsuario.getIdEstatisticaUsuario());
        if (!estatisticasUsuario.isPresent()) {
            return null;
        }

        EstatisticasUsuarioDTO estatisticasUsuarioDTO = new EstatisticasUsuarioDTO();
        estatisticasUsuarioDTO.setIdUsuario(estatisticasUsuario.get().getIdUsuario());
        estatisticasUsuarioDTO.setPercentualAcertos(estatisticasUsuario.get().getPercentualAcertos());
        estatisticasUsuarioDTO.setTempoMedio(estatisticasUsuario.get().getTempoMedio());
        estatisticasUsuarioDTO.setAcertosSeguidos(estatisticasUsuario.get().getAcertosSeguidos());

        int quantidadeQuestaoDiariasAcertosMatematica = 0;
        int quantidadeQuestaoDiariasAcertosHumanas = 0;
        int quantidadeQuestaoDiariasAcertosLinguagem = 0;
        int quantidadeQuestaoDiariasAcertosNatureza = 0;

        int quantidadeQuestaoDiariasRespondidaMatematica = 0;
        int quantidadeQuestaoDiariasRespondidaHumanas = 0;
        int quantidadeQuestaoDiariasRespondidaLinguagem = 0;
        int quantidadeQuestaoDiariasRespondidaNatureza = 0;

        int quantidadeQuestaoAreasAcertosMatematica = 0;
        int quantidadeQuestaoAreasAcertosHumanas = 0;
        int quantidadeQuestaoAreasAcertosLinguagem = 0;
        int quantidadeQuestaoAreasAcertosNatureza = 0;

        int quantidadeQuestaoAreasRespondidaMatematica = 0;
        int quantidadeQuestaoAreasRespondidaHumanas = 0;
        int quantidadeQuestaoAreasRespondidaLinguagem = 0;
        int quantidadeQuestaoAreasRespondidaNatureza = 0;

        for (Integer idQuestao : estatisticasQuestoesUsuario.getIdsQuestoesRespondidasDiaria()) {
            QuestaoDiaria questao = questaoDiariaRepository.findById(idQuestao).orElse(null);
            if (questao != null) {
                switch (questao.getFkCourseId()) {
                    case 38 -> quantidadeQuestaoDiariasRespondidaMatematica++;
                    case 40 -> quantidadeQuestaoDiariasRespondidaHumanas++;
                    case 37 -> quantidadeQuestaoDiariasRespondidaLinguagem++;
                    case 39 -> quantidadeQuestaoDiariasRespondidaNatureza++;
                }
            }
        }

        for (Integer idQuestao : estatisticasQuestoesUsuario.getIdsQuestoesAcertadasDiaria()) {
            QuestaoDiaria questao = questaoDiariaRepository.findById(idQuestao).orElse(null);
            if (questao != null) {
                switch (questao.getFkCourseId()) {
                    case 38 -> quantidadeQuestaoDiariasAcertosMatematica++;
                    case 40 -> quantidadeQuestaoDiariasAcertosHumanas++;
                    case 37 -> quantidadeQuestaoDiariasAcertosLinguagem++;
                    case 39 -> quantidadeQuestaoDiariasAcertosNatureza++;
                }
            }
        }

        estatisticasUsuarioDTO.setQuantidadeQuestaoDiariasAcertosMatematica(quantidadeQuestaoDiariasAcertosMatematica);
        estatisticasUsuarioDTO.setQuantidadeQuestaoDiariasAcertosHumanas(quantidadeQuestaoDiariasAcertosHumanas);
        estatisticasUsuarioDTO.setQuantidadeQuestaoDiariasAcertosLinguagem(quantidadeQuestaoDiariasAcertosLinguagem);
        estatisticasUsuarioDTO.setQuantidadeQuestaoDiariasAcertosNatureza(quantidadeQuestaoDiariasAcertosNatureza);
        estatisticasUsuarioDTO.setQuantidadeQuestaoDiariasRespondidaMatematica(quantidadeQuestaoDiariasRespondidaMatematica);
        estatisticasUsuarioDTO.setQuantidadeQuestaoDiariasRespondidaHumanas(quantidadeQuestaoDiariasRespondidaHumanas);
        estatisticasUsuarioDTO.setQuantidadeQuestaoDiariasRespondidaLinguagem(quantidadeQuestaoDiariasRespondidaLinguagem);
        estatisticasUsuarioDTO.setQuantidadeQuestaoDiariasRespondidaNatureza(quantidadeQuestaoDiariasRespondidaNatureza);



        for (Integer idQuestao : estatisticasQuestoesUsuario.getIdsQuestoesRespondidasPorArea()) {
            QuestaoDiaria questao = questaoDiariaRepository.findById(idQuestao).orElse(null);
            if (questao != null) {
                switch (questao.getFkCourseId()) {
                    case 38 -> quantidadeQuestaoAreasRespondidaMatematica++;
                    case 40 -> quantidadeQuestaoAreasRespondidaHumanas++;
                    case 37 -> quantidadeQuestaoAreasRespondidaLinguagem++;
                    case 39 -> quantidadeQuestaoAreasRespondidaNatureza++;
                }
            }
        }

        for (Integer idQuestao : estatisticasQuestoesUsuario.getIdsQuestoesAcertadasPorArea()) {
            QuestaoDiaria questao = questaoDiariaRepository.findById(idQuestao).orElse(null);
            if (questao != null) {
                switch (questao.getFkCourseId()) {
                    case 38 -> quantidadeQuestaoAreasAcertosMatematica++;
                    case 40 -> quantidadeQuestaoAreasAcertosHumanas++;
                    case 37 -> quantidadeQuestaoAreasAcertosLinguagem++;
                    case 39 -> quantidadeQuestaoAreasAcertosNatureza++;
                }
            }
        }


        estatisticasUsuarioDTO.setQuantidadeQuestaoAreasAcertosMatematica(quantidadeQuestaoAreasAcertosMatematica);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAreasAcertosHumanas(quantidadeQuestaoAreasAcertosHumanas);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAreasAcertosLinguagem(quantidadeQuestaoAreasAcertosLinguagem);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAreasAcertosNatureza(quantidadeQuestaoAreasAcertosNatureza);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAreasRespondidaMatematica(quantidadeQuestaoAreasRespondidaMatematica);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAreasRespondidaHumanas(quantidadeQuestaoAreasRespondidaHumanas);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAreasRespondidaLinguagem(quantidadeQuestaoAreasRespondidaLinguagem);
        estatisticasUsuarioDTO.setQuantidadeQuestaoAreasRespondidaNatureza(quantidadeQuestaoAreasRespondidaNatureza);

        return estatisticasUsuarioDTO;
    }

    public String getUltimoDiaComEstatisticas(Integer idUsuario) {
        return repository.findUltimaDataComEstatisticas(idUsuario).toString();
    }
}
