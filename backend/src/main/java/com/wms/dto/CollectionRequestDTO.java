package com.wms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionRequestDTO {
    private Long id;
    private Long residentId;
    private String residentUsername;
    private String wasteType;
    private String description;
    private Double quantity;
    private String status;
    private LocalDateTime requestDate;
    private LocalDateTime scheduledDate;
    private LocalDateTime completedDate;
}
