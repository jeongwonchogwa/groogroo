package com.jwcg.groogroo.model.dto.report;

import com.jwcg.groogroo.model.entity.ContentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestReportedContentDto {
    private ContentType contentType;
    private Long targetId;
}
