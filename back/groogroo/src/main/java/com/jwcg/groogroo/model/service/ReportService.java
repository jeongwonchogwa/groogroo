package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.report.RequestDeleteReportedContent;
import com.jwcg.groogroo.model.dto.report.RequestReportListDto;
import com.jwcg.groogroo.model.dto.report.RequestReportDto;
import com.jwcg.groogroo.model.entity.ContentType;
import com.jwcg.groogroo.model.entity.Report;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final TreeRepository treeRepository;
    private final GardenRepository gardenRepository;
    private final FlowerRepository flowerRepository;
    private final FruitRepository fruitRepository;

    // 신고하기
    public void report(Long userId, RequestReportDto requestReportDto) {
        ContentType contentType = requestReportDto.getContentType();
        Long targetId = requestReportDto.getTargetId();

        // 유효성 검사
        boolean isExist = false;
        switch(contentType){
            case TREE :
                isExist = treeRepository.existsById(targetId);
                break;
            case FRUIT:
                isExist = fruitRepository.existsById(targetId);
                break;
            case FLOWER:
                isExist = flowerRepository.existsById(targetId);
                break;
            case GARDEN:
                isExist = gardenRepository.existsById(targetId);
        }

        if(!isExist) throw new NotFoundException("신고 실패 - 존재하지 않는 컨텐츠");

        Report report = Report.builder()
                .reporterId(userId)
                .content(requestReportDto.getContent())
                .contentType(contentType)
                .targetId(targetId)
                .build();
        reportRepository.save(report);
    }

    // 내 신고 내역 조회
    @Transactional(readOnly = true)
    public List<Report> getMyReports(Long userId) {
        return reportRepository.findAllByReporterId(userId);
    }

    // 접수된 신고내역 10개씩 오래된 순으로 조회
    @Transactional(readOnly = true)
    public List<Report> getReportList(RequestReportListDto requestReportListDto) {
        Pageable pageable = PageRequest.of(requestReportListDto.getPageNumber(), 10, Sort.by(Sort.Order.asc("id")));
        if (requestReportListDto.getCompleted() == null) {
            return reportRepository.findAll(pageable).getContent();
        }else{
            return reportRepository.findByCompleted(requestReportListDto.getCompleted(),pageable);
        }
    }

    // 처리 완료한 신고 내역 & 동일한 신고내역 목록 한번에 처리 완료로 업데이트
    @Transactional
    public void updateCompleted(RequestDeleteReportedContent reportedContent) {
        reportRepository.completeReport(reportedContent.getTargetId(), reportedContent.getContentType());
    }
}
