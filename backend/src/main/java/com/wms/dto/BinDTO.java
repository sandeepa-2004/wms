package com.wms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BinDTO {
    private Long id;
    private String location;
    private Double capacity;
    private Double currentLevel;
    private String type;
    private String status;
}
