package com.projeto2.nexo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemQuestaoDiaria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_question_id")
    private QuestaoDiaria questaoDiaria;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "correct_item")
    private Boolean correctItem;
}
