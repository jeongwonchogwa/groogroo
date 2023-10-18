package com.jwcg.groogroo.model.dto.Garden;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestGardenGenerationDto {

    private String name;
    private String description;
    private int x;
    private int y;
    private String imageUrl;
}
