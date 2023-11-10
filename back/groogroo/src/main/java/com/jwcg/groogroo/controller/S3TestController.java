package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.service.S3UploadService;
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

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "S3", description = "S3 테스트 API")
@RequestMapping("/test")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
@Slf4j
public class S3TestController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final S3UploadService s3UploadService;

    @Operation(summary = "S3 업로드 테스트", description = "S3에 multipartFile 업로드하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "S3 업로드 성공"),
            @ApiResponse(responseCode = "500", description = "S3 업로드 실패 - 내부 서버 오류")
    })
    @PostMapping(value = "/upload/{dirName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> s3Upload(@RequestPart MultipartFile multipartFile, @PathVariable String dirName) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("S3에 multipartfile 업로드");
            String fileUrl = s3UploadService.upload(multipartFile, "dirName");
            log.info("S3 업로드 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "S3 업로드 성공");
            response.put("fileUrl", fileUrl);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (IOException e) {
            log.info("S3 업로드 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "S3 업로드 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
