package com.wms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Double capacity;

    @Column(nullable = false)
    private Double currentLevel;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String status;
}
