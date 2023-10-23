package com.jwcg.groogroo.model.dto.user;

import com.jwcg.groogroo.model.entity.ContentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestReportDto {
    private Long reporterId;
    private String content;
    private ContentType contentType;
    private Long targetId;
}
