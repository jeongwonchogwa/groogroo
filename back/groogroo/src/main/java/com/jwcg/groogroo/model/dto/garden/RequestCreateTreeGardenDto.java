package com.jwcg.groogroo.model.dto.garden;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCreateTreeGardenDto {
    private Long gardenId;
    private String imageUrl;
    private int x;
    private int y;
    private boolean preset;
}
