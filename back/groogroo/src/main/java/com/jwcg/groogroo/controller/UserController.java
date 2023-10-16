package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.dto.tree.RequestTreeGenerationDto;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.service.KakaoUserService;
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

    private final KakaoUserService kakaoUserService;

    @Operation(summary = "카카오 로그인", description = "카카오 로그인 요청 API")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "카카오 로그인 성공"),
            @ApiResponse(responseCode = "500", description = "카카오 로그인 실패 - 서버 오류")
    })
    @GetMapping("/kakao")
    public ResponseEntity<Map<String, Object>> kakao(@RequestParam("code") String code){
        Map<String,Object> response = new HashMap<>();
        try {
            log.info("카카오 로그인");
            User user = kakaoUserService.getToken(code);
            response.put("httpStatus", SUCCESS);
            response.put("message", "카카오 로그인 성공");
            response.put("email", user.getEmail());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("User Controller - 카카오 로그인 실패");
            response.put("httpStatus", FAIL);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
