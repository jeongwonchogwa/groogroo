package com.jwcg.groogroo.model.dto.garden;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseGardenRankingDto {

    private long gardenId;
    private String name;
    private String description;
    private String state;
    private int capacity;
    private int memberCnt;
    private long likes;
    private String url;
}
