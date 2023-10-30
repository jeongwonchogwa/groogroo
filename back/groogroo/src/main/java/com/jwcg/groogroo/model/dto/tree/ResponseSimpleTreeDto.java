package com.jwcg.groogroo.model.dto.tree;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseSimpleTreeDto {
    private Long id;
    private String imageUrl;
    private String name;
}
