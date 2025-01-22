package com.projeto2.nexo.external.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class QuestaoDTO {
    private Integer id;

    @JsonProperty("base_text")
    private String baseText;

    private String stem;
    private Integer validated;

    @JsonProperty("fk_skill_id")
    private Integer fkSkillId;

    @JsonProperty("fk_user_id")
    private Integer fkUserId;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;
    private String reference;

    @JsonProperty("fk_course_id")
    private Integer fkCourseId;
    private Integer year;

    @JsonProperty("fk_type_of_evaluation_id")
    private Integer fkTypeOfEvaluationId;

    @JsonProperty("fk_regulation_id")
    private Integer fkRegulationId;

    @JsonProperty("initial_difficulty")
    private BigDecimal initialDifficulty;
    private BigDecimal elo;
    private Integer generatedByLLM;
    private String difficulty;
    private Integer totalAnswers;
    private CursoDTO course;

    @JsonProperty("question_items")
    private List<ItemQuestaoDTO> questionItems;
}
