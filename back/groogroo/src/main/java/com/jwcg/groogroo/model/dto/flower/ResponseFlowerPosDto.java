package com.jwcg.groogroo.model.dto.flower;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseFlowerPosDto {
    private long id;
    private int x;
    private int y;
    private String imageUrl;
}
