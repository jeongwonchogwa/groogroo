package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.user.RequestReportDto;
import com.jwcg.groogroo.model.entity.ContentType;
import com.jwcg.groogroo.model.entity.Garden;
import com.jwcg.groogroo.model.entity.GardenRole;
import com.jwcg.groogroo.model.entity.Report;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class ReportService {

    private ReportRepository reportRepository;
    private TreeRepository treeRepository;
    private GardenRepository gardenRepository;
    private FlowerRepository flowerRepository;
    private FruitRepository fruitRepository;

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
    public List<Report> getMyReports(Long userId) {
        return reportRepository.findAllByReporterId(userId);
    }
}
