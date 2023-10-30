package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.dto.report.ResponseReportListDto;
import com.jwcg.groogroo.model.entity.ContentType;
import com.jwcg.groogroo.model.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT NEW com.jwcg.groogroo.model.dto.report.ResponseReportListDto" +
            "(r.id, r.userReport.reporter.id, r.userReport.reporter.email, r.content, r.completed, " +
            "r.contentType, r.targetId, " +
            "r.userReport.reportedUser.id, r.userReport.reportedUser.email) " +
            "FROM Report r LEFT JOIN r.userReport.reportedUser")
    Page<ResponseReportListDto> findResponseReportListDto(Pageable pageable);

    @Query("SELECT NEW com.jwcg.groogroo.model.dto.report.ResponseReportListDto" +
            "(r.id, r.userReport.reporter.id, r.userReport.reporter.email, r.content, r.completed, " +
            "r.contentType, r.targetId, " +
            "r.userReport.reportedUser.id, r.userReport.reportedUser.email) " +
            "FROM Report r LEFT JOIN r.userReport.reportedUser WHERE r.completed = :completed")
    Page<ResponseReportListDto> findResponseReportListDtoByCompleted(@Param("completed") boolean completed, Pageable pageable);

    @Modifying
    @Query("update Report r set r.completed = true where r.targetId = :targetId AND r.contentType = :contentType AND r.completed = false")
    int completeReport(@Param("targetId") Long targetId, @Param("contentType") ContentType contentType);
}
