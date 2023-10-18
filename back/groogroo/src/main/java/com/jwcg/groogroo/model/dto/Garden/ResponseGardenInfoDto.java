package com.jwcg.groogroo.model.dto.Garden;

import com.jwcg.groogroo.model.dto.flower.ResponseFlowerPosDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreePosDto;
import com.jwcg.groogroo.model.entity.Garden;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseGardenInfoDto {
    private String name;
    private String description;

    private List<ResponseFlowerPosDto> flowerPos;
    private List<ResponseTreePosDto> treePos;
}
