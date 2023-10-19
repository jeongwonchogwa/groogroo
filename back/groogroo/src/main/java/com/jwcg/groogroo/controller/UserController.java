package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.util.JwtUtil;
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

    @Operation(summary = "로그아웃", description = "accessToken으로 로그아웃하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그아웃 성공"),
            @ApiResponse(responseCode = "500", description = "로그아웃 실패 - 내부 서버 오류"),
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
            log.info("User Controller - 로그아웃 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "로그아웃 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "토큰 재발급", description = "refreshToken으로 accessToken 재발급하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "토큰 재발급 성공"),
            @ApiResponse(responseCode = "500", description = "토큰 재발급 실패 - 내부 서버 오류"),
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
        }catch (Exception e) {
            log.info("User Controller - accessToken 재발급 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "accessToken 재발급 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}