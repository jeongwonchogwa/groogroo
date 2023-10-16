package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.service.JwtService;
import com.jwcg.groogroo.model.service.TreeService;
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
@Tag(name = "tree", description = "나무 관련 API")
@RequestMapping("/tree")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
@Slf4j
public class TreeController {
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final JwtService jwtService;
    private final TreeService treeService;

    @Operation(summary = "메인 나무 생성", description = "해당 유저가 처음 그루그루에 접근했을 때 메인 나무를 생성할 때 사용되는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "메인 나무 생성 성공"),
            @ApiResponse(responseCode = "500", description = "메인 나무 생성 실패 - 내부 서버 오류"),
    })
    @PostMapping()
    public ResponseEntity<Map<String, Object>> makeTree(@RequestHeader("Authorization") String token) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 메인 나무 생성");
            Long userId = jwtService.extractUserId(token);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 메인 나무 생성 실패");
            response.put("httpStatus", FAIL);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
