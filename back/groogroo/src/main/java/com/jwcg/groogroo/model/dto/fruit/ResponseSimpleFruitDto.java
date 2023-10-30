package com.jwcg.groogroo.model.dto.fruit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseSimpleFruitDto {
    private long id;
    private String writerNickname;
    private String content;
}
