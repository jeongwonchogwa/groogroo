package com.jwcg.groogroo.model.dto.tree;

import com.jwcg.groogroo.model.dto.fruit.ResponseFruitDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseTreeDto {
    private Long id;
    private String imageUrl;
    private String name;
    private List<ResponseFruitDto> fruits;
    private int fruitsCount;
    private String email;
}
