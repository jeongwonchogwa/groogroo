package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.exception.CustomException;
import com.jwcg.groogroo.model.dto.report.RequestReportDto;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.model.service.ReportService;
import com.jwcg.groogroo.model.service.UserService;
import com.jwcg.groogroo.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.webjars.NotFoundException;

import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "User", description = "회원 API")
@RequestMapping("/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
@Slf4j
public class UserController {
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final ReportService reportService;

    @Operation(summary = "로그아웃", description = "accessToken으로 로그아웃하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그아웃 성공"),
            @ApiResponse(responseCode = "500", description = "로그아웃 실패 - 내부 서버 오류")
    })
    @PostMapping()
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String token) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("accessToken으로 Redis에 있는 정보 삭제");
            jwtUtil.deleteRefreshToken(token);
            log.info("로그아웃 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "로그아웃 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("로그아웃 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "로그아웃 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "토큰 재발급", description = "refreshToken으로 accessToken 재발급하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "토큰 재발급 성공"),
            @ApiResponse(responseCode = "401", description = "토큰 재발급 실패 - 유효하지 않은 토큰, 재로그인 필요"),
            @ApiResponse(responseCode = "500", description = "토큰 재발급 실패 - 내부 서버 오류")
    })
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(@RequestHeader("Authorization") String token) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("accessToken 재발급");
            String newAccessToken = jwtUtil.republishAccessToken(token);
            response.put("httpStatus", SUCCESS);
            response.put("message", "accessToken 재발급 성공");
            response.put("accessToken", newAccessToken);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (CustomException e){
            log.info(e.getMessage());
            response.put("httpStatus", FAIL);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, e.getHttpStatus());
        } catch (Exception e) {
            log.info("accessToken 재발급 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "accessToken 재발급 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 탈퇴 성공"),
            @ApiResponse(responseCode = "500", description = "회원 탈퇴 실패 - 내부 서버 오류")
    })
    @PatchMapping()
    public ResponseEntity<Map<String, Object>> withdraw(@RequestHeader("Authorization") String token) {
        token = token.split(" ")[1];
        Long userId = jwtUtil.getId(token);

        Map<String,Object> response = new HashMap<>();

        try {
            log.info("회원 탈퇴");
            log.info("token: {}", token);
            log.info("userId: {}", userId);
            userService.updateStatus(userId, UserStatus.WITHDRAWAL);
            log.info("회원 탈퇴 성공 => 로그아웃");
            jwtUtil.deleteRefreshToken(token);
            log.info("로그아웃 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "회원 탈퇴 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (CustomException e) {
            log.info(e.getMessage());
            response.put("httpStatus", FAIL);
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, e.getHttpStatus());
        } catch (Exception e) {
            log.info("회원 탈퇴 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "회원 탈퇴 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "신고하기", description = "신고 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 성공"),
            @ApiResponse(responseCode = "404", description = "신고 실패 - 존재하지 않는 컨텐츠"),
            @ApiResponse(responseCode = "500", description = "신고 실패 - 내부 서버 오류")
    })
    @PostMapping("/report")
    public ResponseEntity<Map<String, Object>> report(@RequestHeader("Authorization") String token, @RequestBody RequestReportDto requestReportDto) {
        token = token.split(" ")[1];
        Long userId = jwtUtil.getId(token);
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("신고하기");
            reportService.report(userId, requestReportDto);
            log.info("신고 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "신고 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch(CustomException e){
            log.info(e.getMessage());
            response.put("httpStatus", FAIL);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, e.getHttpStatus());
        } catch(Exception e) {
            log.info("신고 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "신고 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @Operation(summary = "내 신고 내역 조회", description = "내 신고내역 조회 API")
//    @ApiResponses({
//            @ApiResponse(responseCode = "200", description = "내 신고 내역 조회 성공"),
//            @ApiResponse(responseCode = "500", description = "내 신고 내역 조회 실패 - 내부 서버 오류")
//    })
//    @GetMapping()
//    public ResponseEntity<Map<String, Object>> getMyReports(@RequestHeader("Authorization") String token) {
//        token = token.split(" ")[1];
//        Long userId = jwtUtil.getId(token);
//        Map<String,Object> response = new HashMap<>();
//
//        try {
//            log.info("내 신고 내역 조회");
//            List<ResponseReportListDto> list = reportService.getMyReports(userId);
//            log.info("내 신고 내역 조회 성공");
//            response.put("httpStatus", SUCCESS);
//            response.put("message", "내 신고 내역 조회 성공");
//            response.put("reportList", list);
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        }catch (Exception e) {
//            log.info("내 신고 내역 조회 실패");
//            response.put("httpStatus", FAIL);
//            response.put("message", "내 신고 내역 조회 실패");
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @Operation(summary = "크레딧 조회", description = "userId로 크레딧 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "크레딧 조회 성공"),
            @ApiResponse(responseCode = "500", description = "크레딧 조회 실패 - 내부 서버 오류")
    })
    @GetMapping()
    public ResponseEntity<Map<String, Object>> getCredit(@RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromAuthorization(token);

        Map<String,Object> response = new HashMap<>();

        try {
            log.info("크레딧 조회");
            int credit = userService.getCredit(userId);
            log.info("크레딧 조회 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "크레딧 조회 성공");
            response.put("credit", credit);

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("크레딧 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "크레딧 조회 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "크레딧 차감", description = "userId로 크레딧 차감하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "크레딧 차감 성공"),
            @ApiResponse(responseCode = "500", description = "크레딧 차감 실패 - 내부 서버 오류")
    })
    @PatchMapping("/credit")
    public ResponseEntity<Map<String, Object>> deductCredit(@RequestHeader("Authorization") String token) {
        Long userId = getUserIdFromAuthorization(token);

        Map<String,Object> response = new HashMap<>();

        try {
            log.info("크레딧 차감");
            userService.updateCredit(userId, -1);
            log.info("크레딧 차감 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "크레딧 차감 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("크레딧 차감 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "크레딧 차감 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * 헤더에서 토큰 추출해서 userId 가져오기
     * @param token
     * @return
     */
    private Long getUserIdFromAuthorization(String token) {
        token = token.split(" ")[1];
        return jwtUtil.getId(token);
    }
}