package com.jwcg.groogroo.model.dto.tree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseSimpleTreeGardenDto {
    private Long id;
    private String imageUrl;
}
