package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
