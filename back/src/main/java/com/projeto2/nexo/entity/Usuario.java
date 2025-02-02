package com.projeto2.nexo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    @NotEmpty(message = "{campo.nome.obrigatorio}")
    private String nome;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String senha;

    private Integer qtd_moedas;
    private Integer qtd_dicas;
    private Integer qtd_pulos;
    private Integer qtd_lixeira;
    private Boolean desafio_completo;

    private Integer qtd_acertos_matematica;
    private Integer qtd_questoes_matematica;
    private Integer qtd_acertos_humanas;
    private Integer qtd_questoes_humanas;
    private Integer qtd_acertos_natureza;
    private Integer qtd_questoes_natureza;
    private Integer qtd_acertos_linguagens;
    private Integer qtd_questoes_linguagens;
}
