package com.wms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "collection_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resident_id", nullable = false)
    private User resident;

    @Column(nullable = false)
    private String wasteType;

    private String description;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    private LocalDateTime scheduledDate;

    private LocalDateTime completedDate;
}
