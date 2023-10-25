package com.jwcg.groogroo.model.dto.garden;

import com.jwcg.groogroo.model.dto.flower.ResponseFlowerPosDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreePosDto;
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

    private long gardenId;
    private String name;
    private String description;
    private int capacity;
    private int memberCnt;
    private long likes;
    private String state;

    private List<ResponseFlowerPosDto> flowerPos;
    private List<ResponseTreePosDto> treePos;
}
