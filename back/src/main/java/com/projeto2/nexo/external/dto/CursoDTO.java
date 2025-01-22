package com.projeto2.nexo.external.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CursoDTO {
    private Integer id;
    private String initials;
    private String description;

    @JsonProperty("created_at")
    private String createdAt;
    @JsonProperty("updated_at")
    private String updatedAt;
    @JsonProperty("fk_area_id")
    private Integer fkAreaId;
}
