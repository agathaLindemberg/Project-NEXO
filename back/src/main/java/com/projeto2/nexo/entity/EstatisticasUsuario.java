package com.projeto2.nexo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstatisticasUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "percentual_acertos")
    private BigDecimal percentualAcertos;

    @Column(name = "tempo_medio")
    private BigDecimal tempoMedio;

    @Column(name = "acertos_seguidos")
    private int acertosSeguidos;
}
