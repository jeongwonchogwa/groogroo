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
public class ResponseReportListDto {

    private Long id;

    private Long reporterId; // 신고한 사람의 Id

    private String reporterEmail; // 신고한 사람의 Email

    private String content;

    private boolean completed; // 처리 완료 여부

    private ContentType contentType;

    private Long targetId;

    private Long reportedId; // 신고 당한 사람의 Id

    private String reportedEmail; // 신고 당한 사람의 Email

}
