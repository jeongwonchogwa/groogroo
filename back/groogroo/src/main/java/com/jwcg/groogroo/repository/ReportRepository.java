package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.ContentType;
import com.jwcg.groogroo.model.entity.Report;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByReporterId(Long userId);

    List<Report> findByCompleted(boolean completed, Pageable pageable);

    @Modifying
    @Query("update Report r set r.completed = true where r.targetId = :targetId AND r.contentType = :contentType AND r.completed = false")
    int completeReport(@Param("targetId") Long targetId, @Param("contentType") ContentType contentType);
}
