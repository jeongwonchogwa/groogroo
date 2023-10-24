package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Report;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByReporterId(Long userId);

    List<Report> findByCompleted(boolean completed, Pageable pageable);
}
