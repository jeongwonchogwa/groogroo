package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.report.RequestReportDto;
import com.jwcg.groogroo.model.dto.report.RequestReportListDto;
import com.jwcg.groogroo.model.dto.report.RequestReportedContentDto;
import com.jwcg.groogroo.model.dto.report.ResponseReportListDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@AllArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final TreeRepository treeRepository;
    private final TreeGardenRepository treeGardenRepository;
    private final FlowerRepository flowerRepository;
    private final FruitRepository fruitRepository;
    private final UserReportRepository userReportRepository;

    // 신고하기
    public void report(Long userId, RequestReportDto requestReportDto) {
        ContentType contentType = requestReportDto.getContentType();
        Long targetId = requestReportDto.getTargetId();

        User reportedUser = null; // 신고 당한 회원
        switch(contentType){
            case TREE :
                Tree tree = treeRepository.findTreeById(targetId);
                reportedUser = tree.getUser();
                break;
            case FRUIT:
                Fruit fruit = fruitRepository.findFruitById(targetId);
                reportedUser = userRepository.findUserById(fruit.getWriterId());
                break;
            case FLOWER:
                Flower flower = flowerRepository.findFlowerById(targetId);
                reportedUser = flower.getUserGarden().getUser();
                break;
            case TREEGARDEN:
                TreeGarden treeGarden = treeGardenRepository.findTreeGardenById(targetId);
                reportedUser = treeGarden.getTree().getUser();
        }

        User reporter = userRepository.findUserById(userId); // 신고한 회원

        UserReport userReport = UserReport.builder()
                .reporter(reporter)
                .reportedUser(reportedUser)
                .build();

        userReport = userReportRepository.save(userReport);

        Report report = Report.builder()
                .content(requestReportDto.getContent())
                .completed(false)
                .contentType(contentType)
                .targetId(targetId)
                .userReport(userReport)
                .build();

        reportRepository.save(report);
    }

    // 내 신고 내역 조회
//    @Transactional(readOnly = true)
//    public List<ResponseReportListDto> getMyReports(Long userId) {
//        User user = userRepository.findUserById(userId);
//
//        List<Report> reports = reportRepository.findAllByReporter(user);
//        List<ResponseReportListDto> list = new ArrayList<>();
//
//        for(Report report : reports){
//            ResponseReportListDto responseReportListDto = ResponseReportListDto.builder()
//                    .id(report.getId())
//                    .reporterId(report.getUserReport().getReporter().getId())
//                    .reporterEmail(report.getUserReport().getReporter().getEmail())
//                    .content(report.getContent())
//                    .completed(report.isCompleted())
//                    .contentType(report.getContentType())
//                    .targetId(report.getTargetId())
//                    .reportedId(report.getUserReport().getReportedUser().getId())
//                    .reportedEmail(report.getUserReport().getReportedUser().getEmail())
//                    .build();
//
//            list.add(responseReportListDto);
//        }
//        return list;
//    }

    // 접수된 신고내역 10개씩 오래된 순으로 조회
    @Transactional(readOnly = true)
    public Page<ResponseReportListDto> getReportList(RequestReportListDto requestReportListDto) {
        Pageable pageable = PageRequest.of(requestReportListDto.getPageNumber(), 10, Sort.by(Sort.Order.asc("id")));

        Page<ResponseReportListDto> reports;
        if (requestReportListDto.getCompleted() == null) {
            reports = reportRepository.findResponseReportListDto(pageable);
        }else{
            reports = reportRepository.findResponseReportListDtoByCompleted(requestReportListDto.getCompleted(), pageable);
        }

        return reports;
    }

    // 처리 완료한 신고 내역 & 동일한 신고내역 목록 한번에 처리 완료로 업데이트
    @Transactional
    public void updateCompleted(RequestReportedContentDto reportedContent) {
        reportRepository.completeReport(reportedContent.getTargetId(), reportedContent.getContentType());
    }
}
