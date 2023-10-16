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
    private String content;
    private int type;
    private int x;
    private int y;
    private String createTime;
}
