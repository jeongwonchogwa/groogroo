package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.admin.RequestReportListDto;
import com.jwcg.groogroo.model.entity.Report;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.repository.ReportRepository;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class AdminService {

    private ReportRepository reportRepository;
    private UserRepository userRepository;

    // 접수된 신고내역 10개씩 오래된 순으로 조회
    public List<Report> getReportList(RequestReportListDto requestReportListDto) {
        Pageable pageable = PageRequest.of(requestReportListDto.getPageNumber(), 10, Sort.by(Sort.Order.asc("id")));
        if (requestReportListDto.getCompleted() == null) {
            return reportRepository.findAll(pageable).getContent();
        }else{
            return reportRepository.findByCompleted(requestReportListDto.getCompleted(),pageable);
        }
    }

    // 유저 목록 10개씩 조회
    public List<User> getUserList(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by(Sort.Order.asc("id")));
        return userRepository.findAll(pageable).getContent();
    }


}
