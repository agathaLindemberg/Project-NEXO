package com.projeto2.nexo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstatisticasQuestoesUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "idUsuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "id_estatistica_usuario", nullable = false)
    private Integer idEstatisticaUsuario;

    @ElementCollection
    @Column(name = "ids_questoes_acertadas")
    private List<Integer> idsQuestoesRespondidas;

    @ElementCollection
    @Column(name = "ids_questoes_acertadas")
    private List<Integer> idsQuestoesAcertadas;

    @Column(name = "data_realizada")
    private Date dataRealizada;
}
