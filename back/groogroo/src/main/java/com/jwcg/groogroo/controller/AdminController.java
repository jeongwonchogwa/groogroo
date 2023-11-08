package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.dto.flower.ResponseSimpleFlowerDto;
import com.jwcg.groogroo.model.dto.fruit.ResponseSimpleFruitDto;
import com.jwcg.groogroo.model.dto.garden.RequestUpdateJoinStateDto;
import com.jwcg.groogroo.model.dto.report.RequestReportListDto;
import com.jwcg.groogroo.model.dto.report.RequestReportedContentDto;
import com.jwcg.groogroo.model.dto.report.ResponseReportListDto;
import com.jwcg.groogroo.model.dto.tree.ResponseSimpleTreeDto;
import com.jwcg.groogroo.model.dto.tree.ResponseSimpleTreeGardenDto;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.model.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Admin", description = "관리자 API")
@RequestMapping("/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
@Slf4j
public class AdminController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    
    private final UserService userService;
    private final ReportService reportService;
    private final TreeService treeService;
    private final FlowerService flowerService;
    private final FruitService fruitService;
    private final GardenService gardenService;

    @Operation(summary = "신고 접수 내역 조회", description = "신고 접수 내역 오래된 순으로 10개씩 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 접수 내역 조회 성공"),
            @ApiResponse(responseCode = "500", description = "신고 접수 내역 조회 실패 - 내부 서버 오류")
    })
    @GetMapping()
    public ResponseEntity<Map<String, Object>> getReportList(RequestReportListDto requestReportListDto) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("신고 접수 내역 조회");
            Page<ResponseReportListDto> reports = reportService.getReportList(requestReportListDto);

            log.info("신고 접수 내역 조회 성공");
            response.put("httpStatus", "success");
            response.put("message", "신고 접수 내역 조회 성공");
            response.put("totalPages", reports.getTotalPages());
            response.put("reportList", reports.getContent());

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("신고 접수 내역 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "신고 접수 내역 조회 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "신고 접수 대상 상세 조회", description = "신고 접수 대상 상세 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 접수 대상 상세 조회 성공"),
            @ApiResponse(responseCode = "500", description = "신고 접수 대상 상세 조회 실패 - 내부 서버 오류")
    })
    @GetMapping("/detail")
    public ResponseEntity<Map<String, Object>> getReportDetail(RequestReportedContentDto reportedContent) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("신고 접수 대상 상세 조회");
            log.info("Content Type: {}",reportedContent.getContentType());
            log.info("Target Id: {}", reportedContent.getTargetId());
            switch(reportedContent.getContentType()){
                case TREE:
                    log.info("메인 나무 상세 조회");
                    ResponseSimpleTreeDto tree = treeService.getSimpleTreeContent(reportedContent.getTargetId());
                    response.put("content", tree);
                    break;
                case TREEGARDEN:
                    log.info("정원 나무 상세 조회");
                    ResponseSimpleTreeGardenDto treeGarden = treeService.getSimpleTreeGardenContent(reportedContent.getTargetId());
                    response.put("content", treeGarden);
                    break;
                case GARDEN:
                    log.info("정원 상세 조회");
                    String GardenUrl = gardenService.getGardenLink(reportedContent.getTargetId());
                    response.put("gardenUrl", GardenUrl);
                    break;
                case FLOWER:
                    log.info("꽃 상세 조회");
                    ResponseSimpleFlowerDto flower = flowerService.getSimpleFlowerContent(reportedContent.getTargetId());
                    response.put("content", flower);
                    break;
                case FRUIT:
                    log.info("열매 상세 조회");
                    ResponseSimpleFruitDto fruit = fruitService.getSimpleFruitContent(reportedContent.getTargetId());
                    response.put("content", fruit);
            }

            log.info("신고 접수 대상 상세 조회 성공");
            response.put("httpStatus", "success");
            response.put("message", "신고 접수 대상 상세 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("신고 접수 대상 상세 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "신고 접수 대상 상세 조회 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


//    @Operation(summary = "회원 정보 조회", description = "회원 정보 10개씩 조회하는 API")
//    @ApiResponses({
//            @ApiResponse(responseCode = "200", description = "회원 정보 조회 성공"),
//            @ApiResponse(responseCode = "500", description = "회원 정보 조회 실패 - 내부 서버 오류")
//    })
//    @GetMapping("/user")
//    public ResponseEntity<Map<String, Object>> getUserList(int pageNumber) {
//        Map<String,Object> response = new HashMap<>();
//
//        try {
//            log.info("회원 정보 조회");
//            List<ResponseUserDto> list = userService.getUserList(pageNumber);
//            log.info("회원 정보 조회 성공");
//            response.put("httpStatus", SUCCESS);
//            response.put("message", "회원 정보 조회 성공");
//            response.put("reportList", list);
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        }catch (Exception e) {
//            log.info("회원 정보 조회 실패");
//            response.put("httpStatus", FAIL);
//            response.put("message", "회원 정보 조회 실패");
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }


    @Operation(summary = "신고 대상 삭제", description = "신고 대상 삭제하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 대상 삭제 성공"),
            @ApiResponse(responseCode = "500", description = "신고 대상 삭제 실패 - 내부 서버 오류")
    })
    @DeleteMapping()
    public ResponseEntity<Map<String, Object>> deleteReportedContent(@RequestBody RequestReportedContentDto reportedContent) {
        Map<String,Object> response = new HashMap<>();

        try {
            switch(reportedContent.getContentType()){
                case TREE:
                    log.info("메인 나무 삭제");
                    treeService.deleteTree(reportedContent.getTargetId());
                    break;
                case TREEGARDEN:
                    log.info("정워 나무 삭제");
                    treeService.deleteTreeGarden(reportedContent.getTargetId());
                    break;
                case GARDEN:
                    log.info("정원 삭제");
                    gardenService.deleteGarden(reportedContent.getTargetId());
                    break;
                case FLOWER:
                    log.info("꽃 삭제");
                    flowerService.deleteFlower(reportedContent.getTargetId());
                    break;
                case FRUIT:
                    log.info("열매 삭제");
                    fruitService.deleteFruit(reportedContent.getTargetId());
            }
            log.info("처리 상태 변경");
            reportService.updateCompleted(reportedContent);
            log.info("처리 상태 변경 성공");
            log.info("신고 대상 삭제 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "신고 대상 삭제 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("신고 대상 삭제 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "신고 대상 삭제 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "회원 차단", description = "회원 차단하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 차단 성공"),
            @ApiResponse(responseCode = "500", description = "회원 차단 실패 - 내부 서버 오류")
    })
    @PatchMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> blockUser(@PathVariable Long userId) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("회원 차단");
            userService.updateStatus(userId, UserStatus.BLOCK);
            log.info("회원 차단 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "회원 차단 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("회원 차단 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "회원 차단 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 추방", description = "회원을 정원에서 추방시키는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 추방 성공"),
            @ApiResponse(responseCode = "500", description = "정원 추방 실패 - 내부 서버 오류")
    })
    @PatchMapping("/garden")
    public ResponseEntity<Map<String, Object>> banishFromGarden(@RequestHeader("Authorization") String token, @RequestBody RequestUpdateJoinStateDto request) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("정원 추방");
            gardenService.updateOthersJoinState(token, request.getUserId(), request.getGardenId(), "KICK");
            log.info("정원 추방 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 추방 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("정원 추방 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 추방 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}