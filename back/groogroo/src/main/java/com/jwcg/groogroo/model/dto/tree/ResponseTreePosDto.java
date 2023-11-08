package com.jwcg.groogroo.model.dto.tree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseTreePosDto {
    private long id;
    private String name;
    private int x;
    private int y;
    private String imageUrl;
    private int fruitCnt;
}
