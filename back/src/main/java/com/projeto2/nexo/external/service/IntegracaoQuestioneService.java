package com.projeto2.nexo.external.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.projeto2.nexo.external.dto.QuestaoDTO;
import com.projeto2.nexo.external.dto.RequestParametrosDTO;
import com.projeto2.nexo.external.exception.IntegracaoQuestioneException;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.Duration;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Service
public class IntegracaoQuestioneService {

    private final ObjectMapper mapper;
    private static final Gson gson = new Gson();

    @Value("${integracao.questione.url}")
    private String url;

    public List<QuestaoDTO> resgatarQuestoesDiarias(Integer qtdQuestoes, Integer dificuldade, Integer areaConhecimento) {

        RequestParametrosDTO requestParametrosDTO = new RequestParametrosDTO();
        requestParametrosDTO.setQtd_questions(qtdQuestoes);
        requestParametrosDTO.setDificulty(dificuldade);
        requestParametrosDTO.setFk_course_id(areaConhecimento);

        try (Response response = httpBuild(requestParametrosDTO)) {
            String retornoHttp = response.body() != null ? response.body().string() : "";

            if (response.code() == 200) {
                if (StringUtils.isNotEmpty(retornoHttp)) {
                    return jsonParaQuestaoDTO(retornoHttp);
                } else {
                    throw new IntegracaoQuestioneException("(Integracao) Não foram retornados dados!");
                }
            } else {
                throw new IntegracaoQuestioneException(
                        "(Integracao) Erro ao resgatar as questões. Status = " + response.code());
            }
        } catch (IOException e) {
            throw new IntegracaoQuestioneException(
                    "(Integracao) Erro ao acessar o serviço: " + e.getMessage());
        }
    }

    public Response httpBuild(RequestParametrosDTO requestParametrosDTO) {
        String CONTENT_TYPE_JSON = "application/json";

        OkHttpClient client = new OkHttpClient.Builder()
                .callTimeout(Duration.ofSeconds(30))
                .connectionSpecs(Collections.singletonList(ConnectionSpec.CLEARTEXT))
                .build();

        HttpUrl.Builder urlBuilder =
                HttpUrl.parse("http://bancodequestoes.ifce.edu.br/api/public/enem-questions").newBuilder();
        urlBuilder.addQueryParameter("qtd_questions", String.valueOf(requestParametrosDTO.getQtd_questions()));
        urlBuilder.addQueryParameter("dificulty", String.valueOf(requestParametrosDTO.getDificulty()));
        urlBuilder.addQueryParameter("fk_course_id", String.valueOf(requestParametrosDTO.getFk_course_id()));

        Request.Builder requestBuilder = new Request.Builder()
                .url(urlBuilder.build())
                .addHeader("Content-Type", CONTENT_TYPE_JSON);

        requestBuilder.method("GET", null);

        try {
            return client.newCall(requestBuilder.build()).execute();
        } catch (IOException e) {
            throw new IntegracaoQuestioneException(
                    "Erro ao construir a requisição para a Questione: " + e.getMessage());
        }
    }

    private List<QuestaoDTO> jsonParaQuestaoDTO(String json) {
        try {
            Type listType = new TypeToken<List<QuestaoDTO>>() {}.getType();
            return gson.fromJson(json, listType);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String parametrosParaJson(RequestParametrosDTO requestParametrosDTO) {
        try {
            return mapper.writeValueAsString(requestParametrosDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
