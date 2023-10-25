package com.jwcg.groogroo.model.dto.report;

import com.jwcg.groogroo.model.entity.ContentType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestReportDto {
    private String content;
    private ContentType contentType;
    private Long targetId;
}
