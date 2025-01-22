package com.projeto2.nexo.external.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemQuestaoDTO {
    private Integer id;
    private String description;

    @JsonProperty("correct_item")
    private Integer correctItem;
    @JsonProperty("fk_question_id")
    private Integer fkQuestionId;
    @JsonProperty("created_at")
    private String createdAt;
    @JsonProperty("updated_at")
    private String updatedAt;
}
