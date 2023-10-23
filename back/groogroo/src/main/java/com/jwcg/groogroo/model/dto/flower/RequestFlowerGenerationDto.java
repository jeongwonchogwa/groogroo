package com.jwcg.groogroo.model.dto.flower;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestFlowerGenerationDto {
    private long gardenId;
    private String writerNickname;
    private String imageUrl;
    private String content;
    private int x;
    private int y;
}
