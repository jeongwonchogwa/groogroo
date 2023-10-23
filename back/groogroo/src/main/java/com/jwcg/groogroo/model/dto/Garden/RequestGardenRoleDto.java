package com.jwcg.groogroo.model.dto.Garden;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestGardenRoleDto {

    private long gardenId;
    private long targetId;
    private String Role;
}
