package com.jwcg.groogroo.model.dto.tree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestTreeModifyDto {
    private String imageUrl;
    private String name;
}
