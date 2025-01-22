package com.projeto2.nexo.external.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestParametrosDTO {
    private Integer qtd_questions;
    private Integer dificulty;
    private Integer fk_course_id;
}
