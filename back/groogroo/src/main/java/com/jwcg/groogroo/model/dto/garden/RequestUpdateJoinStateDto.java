package com.jwcg.groogroo.model.dto.garden;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestUpdateJoinStateDto {
    Long userId;
    Long gardenId;
    String joinState;
}
