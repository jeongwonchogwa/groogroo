package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.dto.admin.RequestDeleteReportedContent;
import com.jwcg.groogroo.model.dto.admin.RequestReportListDto;
import com.jwcg.groogroo.model.entity.Garden;
import com.jwcg.groogroo.model.entity.Report;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.model.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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

    private AdminService adminService;
    private UserService userService;
    private TreeService treeService;
    private FlowerService flowerService;
    private FruitService fruitService;
    private GardenService gardenService;

    @Operation(summary = "신고 접수 내역 조회", description = "신고 접수 내역 오래된 순으로 10개씩 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 접수 내역 조회 성공"),
            @ApiResponse(responseCode = "500", description = "신고 접수 내역 조회 실패 - 내부 서버 오류")
    })
    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> getReportList(RequestReportListDto requestReportListDto) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("신고 접수 내역 조회");
            List<Report> list = adminService.getReportList(requestReportListDto);
            log.info("신고 접수 내역 조회 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "신고 접수 내역 조회 성공");
            response.put("reportList", list);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("신고 접수 내역 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "신고 접수 내역 조회 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "회원 정보 조회", description = "회원 정보 10개씩 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 정보 조회 성공"),
            @ApiResponse(responseCode = "500", description = "회원 정보 조회 실패 - 내부 서버 오류")
    })
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserList(int pageNumber) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("회원 정보 조회");
            List<User> list = adminService.getUserList(pageNumber);
            log.info("회원 정보 조회 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "회원 정보 조회 성공");
            response.put("reportList", list);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("회원 정보 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "회원 정보 조회 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "회원 차단", description = "회원 차단하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 차단 성공"),
            @ApiResponse(responseCode = "500", description = "회원 차단 실패 - 내부 서버 오류")
    })
    @PatchMapping("/user")
    public ResponseEntity<Map<String, Object>> blockUser(@RequestBody Long userId) {
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

    @Operation(summary = "신고 대상 삭제", description = "신고 대상 삭제하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 대상 삭제 성공"),
            @ApiResponse(responseCode = "500", description = "신고 대상 삭제 실패 - 내부 서버 오류")
    })
    @DeleteMapping()
    public ResponseEntity<Map<String, Object>> deleteReportedContent(@RequestBody RequestDeleteReportedContent reportedContent) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("신고 대상 삭제");
            switch(reportedContent.getContentType()){
                // TREE랑 GARDEN 삭제 어떻게 하지?
                case TREE:
                    break;
                case GARDEN:
                    break;
                case FLOWER:
                    flowerService.deleteFlower(reportedContent.getTargetId());
                    break;
                case FRUIT:
                    fruitService.deleteFruit(reportedContent.getTargetId());
            }
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


}
