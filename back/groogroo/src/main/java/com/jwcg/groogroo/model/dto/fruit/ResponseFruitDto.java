package com.jwcg.groogroo.model.dto.fruit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseFruitDto {
    private long id;
    private long writerId;
    private String writerNickname;
    private String content;
    private String imageUrl;
    private String createTime;
}
