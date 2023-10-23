package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByReporterId(Long userId);
}
