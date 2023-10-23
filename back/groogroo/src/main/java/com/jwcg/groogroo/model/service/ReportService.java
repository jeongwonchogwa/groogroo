package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.user.RequestReportDto;
import com.jwcg.groogroo.model.entity.Report;
import com.jwcg.groogroo.repository.ReportRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class ReportService {

    private ReportRepository reportRepository;

    // 신고하기
    public void report(Report report) {
        reportRepository.save(report);
    }
}
