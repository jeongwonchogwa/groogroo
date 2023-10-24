package com.jwcg.groogroo.model.dto.admin;

import com.jwcg.groogroo.model.entity.ContentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDeleteReportedContent {
    private ContentType contentType;
    private Long targetId;
}
