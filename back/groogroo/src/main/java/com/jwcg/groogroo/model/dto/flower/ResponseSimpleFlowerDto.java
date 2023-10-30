package com.jwcg.groogroo.model.dto.flower;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseSimpleFlowerDto {
    private Long id;
    private String content;
    private String writerNickname;
}
