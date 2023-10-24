package com.jwcg.groogroo.model.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestBanishFromGardenDto {
    Long userId;
    Long gardenId;
}
