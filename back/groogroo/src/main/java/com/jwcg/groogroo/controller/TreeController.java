package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.dto.fruit.ResponseFruitPresetDto;
import com.jwcg.groogroo.model.dto.tree.*;
import com.jwcg.groogroo.model.entity.Preset;
import com.jwcg.groogroo.model.service.S3UploadService;
import com.jwcg.groogroo.model.service.TreeService;
import com.jwcg.groogroo.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    private final JwtUtil jwtUtil;
    private final TreeService treeService;
    private final S3UploadService s3UploadService;

    @Operation(summary = "나무 이름 중복 확인", description = "메인 나무를 생성할 때 나무 이름 중복 확인에 사용되는 API : true: 중복, false: 중복 아님")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "나무 이름 중복 확인 성공"),
            @ApiResponse(responseCode = "500", description = "나무 이름 중복 확인 실패 - 내부 서버 오류"),
    })
    @GetMapping("/check/{name}")
    public ResponseEntity<Map<String, Object>> checkNameDuplicate(@PathVariable String name){
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 나무 이름 중복 확인");
            response.put("result", treeService.checkNameDuplicate(name));
            response.put("httpStatus", SUCCESS);
            response.put("message", "나무 이름 중복 확인 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 나무 이름 중복 확인 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "나무 이름 중복 확인 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "나무 이미지 저장", description = "나무의 이미지를 저장할 때 사용되는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "나무 이미지 저장 성공"),
            @ApiResponse(responseCode = "500", description = "나무 이미지 저장 실패 - 내부 서버 오류"),
    })
    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> makeTreeImage(@RequestPart MultipartFile multipartFile) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 나무 이미지 저장");
            String fileUrl = s3UploadService.upload(multipartFile, "tree");
            response.put("imageUrl", fileUrl);
            response.put("httpStatus", SUCCESS);
            response.put("message", "나무 이미지 저장 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 나무 이미지 저장 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "나무 이미지 저장 실패");


            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "메인 나무 생성", description = "해당 유저가 처음 그루그루에 접근했을 때 메인 나무를 생성할 때 사용되는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "메인 나무 생성 성공"),
            @ApiResponse(responseCode = "500", description = "메인 나무 생성 실패 - 내부 서버 오류"),
    })
    @PostMapping()
    public ResponseEntity<Map<String, Object>> makeMainTree(@RequestHeader("Authorization") String token, @RequestBody RequestTreeGenerationDto requestTreeGenerationDto) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 메인 나무 생성");
            Long userId = jwtUtil.getId(token);
            treeService.makeMainTree(userId, requestTreeGenerationDto.getImageUrl(), requestTreeGenerationDto.getName());

            response.put("httpStatus", SUCCESS);
            response.put("message", "메인 나무 생성 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 메인 나무 생성 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "메인 나무 생성 실패");


            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "메인 나무 수정", description = "메인 나무의 이미지나 이름을 변경하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "메인 나무 수정 성공"),
            @ApiResponse(responseCode = "500", description = "메인 나무 수정 실패 - 내부 서버 오류"),
    })
    @PatchMapping()
    public ResponseEntity<Map<String, Object>> modifyMainTreeImage(@RequestHeader("Authorization") String token, @RequestBody RequestTreeModifyDto requestTreeModifyDto) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 메인 나무 수정");
            Long userId = jwtUtil.getId(token);
            treeService.modifyMainTree(userId,
                    requestTreeModifyDto.getImageUrl(),
                    requestTreeModifyDto.getName());
            response.put("httpStatus", SUCCESS);
            response.put("message", "메인 나무 수정 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 메인 나무 수정 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "메인 나무 수정 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "메인 나무 조회", description = "나무의 내용(열매)들을 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "메인 나무 조회 성공"),
            @ApiResponse(responseCode = "500", description = "메인 나무 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getMainTreeContents(@RequestHeader("Authorization") String token) {
       token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 메인 나무 조회");
            Long userId = jwtUtil.getId(token);
            log.info("id: {}", userId);
            ResponseTreeDto tree = treeService.getMainTreeContents(userId);

            response.put("tree", tree);

            response.put("httpStatus", SUCCESS);
            response.put("message", "메인 나무 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 메인 나무 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "메인 나무 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "나무 검색", description = "검색어(나무 이름)을 포함하는 나무 검색")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "나무 검색 성공"),
            @ApiResponse(responseCode = "500", description = "나무 검색 실패 - 내부 서버 오류"),
    })
    @GetMapping("search/{name}")
    public ResponseEntity<Map<String, Object>> searchTree(@RequestHeader("Authorization") String token, @PathVariable("name") String name) {

        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 나무 검색");
            Long userId = jwtUtil.getId(token);
            List<ResponseTreeDto> trees = treeService.searchTree(userId, name);

            response.put("trees", trees);

            response.put("httpStatus", SUCCESS);
            response.put("message", "나무 검색 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 나무 검색 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "나무 검색 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "나무 상세 조회", description = "다른 사람의 나무 상세 및 내가 쓴 열매 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "나무 상세 조회 성공"),
            @ApiResponse(responseCode = "500", description = "나무 상세 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("detail/{treeId}")
    public ResponseEntity<Map<String, Object>> getDetailTreeContents(@RequestHeader("Authorization") String token, @PathVariable Long treeId) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 나무 상세 조회");
            Long userId = jwtUtil.getId(token);
            log.info("id: {}", userId);
            ResponseTreeDto tree = treeService.getDetailTreeContents(userId, treeId);

            response.put("tree", tree);
            response.put("httpStatus", SUCCESS);
            response.put("message", "나무 상세 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 나무 상세 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "나무 상세 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "나무 프리셋 추가", description = "마음에 드는 나무 이미지를 자신의 프리셋에 추가하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "나무 프리셋 추가"),
            @ApiResponse(responseCode = "500", description = "나무 프리셋 추가 실패 - 내부 서버 오류"),
    })
    @PostMapping("/preset")
    public ResponseEntity<Map<String, Object>> addTreePreset(@RequestHeader("Authorization") String token, @RequestBody RequestTreePresetDto requestTreePresetDto) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 나무 프리셋 추가");
            Long userId = jwtUtil.getId(token);
            treeService.addTreePreset(userId, requestTreePresetDto.getImageUrl());

            response.put("httpStatus", SUCCESS);
            response.put("message", "나무 프리셋 추가 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 나무 프리셋 추가 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "나무 프리셋 추가 실패");


            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Operation(summary = "나무 프리셋 조회", description = "나무를 생성할 때 선택할 프리셋을 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "나무 프리셋 조회 성공"),
            @ApiResponse(responseCode = "500", description = "나무 프리셋 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/preset")
    public ResponseEntity<Map<String, Object>> getTreePreset(@RequestHeader("Authorization") String token) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 나무 프리셋 조회");
            long userId = jwtUtil.getId(token);
            List<ResponseTreePresetDto> returnData = treeService.getTreePreset(userId);

            response.put("presets", returnData);
            response.put("httpStatus", SUCCESS);
            response.put("message", "나무 프리셋 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 나무 프리셋 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "나무 프리셋 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "나무 프리셋 삭제", description = "나무 프리셋을 삭제하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "나무 프리셋 삭제 성공"),
            @ApiResponse(responseCode = "500", description = "나무 프리셋 삭제 실패 - 내부 서버 오류"),
    })
    @DeleteMapping("/preset/{treeUserPresetId}")
    public ResponseEntity<Map<String, Object>> deleteTreePreset(@PathVariable long treeUserPresetId) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 나무 프리셋 삭제");
            treeService.deleteTreePreset(treeUserPresetId);

            response.put("httpStatus", SUCCESS);
            response.put("message", "나무 프리셋 삭제 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 나무 프리셋 삭제 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "나무 프리셋 삭제 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
