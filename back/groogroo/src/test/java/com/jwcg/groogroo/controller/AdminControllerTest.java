package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.common.BaseIntegrationTest;
import com.jwcg.groogroo.config.UserSetUp;
import com.jwcg.groogroo.model.dto.report.RequestReportListDto;
import com.jwcg.groogroo.model.entity.ContentType;
import com.jwcg.groogroo.model.entity.Report;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserReport;
import com.jwcg.groogroo.repository.ReportRepository;
import com.jwcg.groogroo.repository.UserReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Admin 통합 테스트
 */
class AdminControllerTest extends BaseIntegrationTest {

    @Autowired
    UserSetUp userSetUp;

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    UserReportRepository userReportRepository;

    @Test
    @DisplayName("신고 접수 내역 조회")
    public void logoutSuccess() throws Exception {
        // Given
        String accessToken = userSetUp.saveAdmin();
        User testUser = userSetUp.createTestUser();

        // 신고 내역 저장
        List<Report> reportList = IntStream.rangeClosed(1, 11)
                .mapToObj(i -> {
                    UserReport userReport = UserReport.builder()
                            .reporter(testUser)
                            .reportedUser(testUser)
                            .build();

                    userReportRepository.save(userReport);

                    return Report.builder()
                            .content("test content" + i)
                            .completed(false)
                            .contentType(ContentType.TREE)
                            .targetId((long)i)
                            .userReport(userReport)
                            .build();
                })
                .collect(Collectors.toList());

        reportRepository.saveAll(reportList);

        RequestReportListDto requestReportListDto = RequestReportListDto.builder()
                .pageNumber(1)
                .completed(false)
                .build();

        // When
        ResultActions result = mvc.perform(get("/admin")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestReportListDto)));

        //Then
        result.andDo(print())
                .andExpect(status().isOk());
    }

}