package com.projeto2.nexo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestaoDiaria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "base_text", columnDefinition = "TEXT")
    private String baseText;

    @Column(name = "stem", columnDefinition = "TEXT")
    private String stem;

    @Column(name = "fk_course_id")
    private Integer fkCourseId;

    @Column(name = "year")
    private Integer year;

    @Column(name = "difficulty")
    private Integer difficulty;
}
