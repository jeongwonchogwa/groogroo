package com.jwcg.groogroo.model.dto.fruit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestFruitGenerationDto {
    private long treeId;
    private String writerNickname;
    private String imageUrl;
    private String content;

}
