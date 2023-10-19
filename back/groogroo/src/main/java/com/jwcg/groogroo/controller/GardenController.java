package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.dto.Garden.RequestGardenGenerationDto;
import com.jwcg.groogroo.model.dto.Garden.ResponseGardenInfoDto;
import com.jwcg.groogroo.model.dto.tree.RequestTreeGenerationDto;
import com.jwcg.groogroo.model.service.GardenService;
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
@Tag(name = "garden", description = "정원 관련 API")
@RequestMapping("/garden")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
@Slf4j
public class GardenController {
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final JwtUtil jwtUtil;
    private final GardenService gardenService;

    @Operation(summary = "정원 생성", description = "정원을 새로 생성하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 생성 성공"),
            @ApiResponse(responseCode = "500", description = "정원 생성 실패 - 내부 서버 오류"),
    })
    @PostMapping()
    public ResponseEntity<Map<String, Object>> makeGarden(@RequestHeader String token, @RequestBody RequestGardenGenerationDto requestGardenGenerationDto) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 정원 생성");
            Long userId = jwtUtil.getId(token);

            gardenService.makeGarden(userId,
                    requestGardenGenerationDto.getName(),
                    requestGardenGenerationDto.getDescription(),
                    requestGardenGenerationDto.getX(),
                    requestGardenGenerationDto.getY(),
                    requestGardenGenerationDto.getImageUrl());

            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 생성 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 정원 생성 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 생성 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 조회", description = "정원과 꽃, 나무의 위치 정보를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 조회 성공"),
            @ApiResponse(responseCode = "500", description = "정원 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/{gardenId}")
    public ResponseEntity<Map<String, Object>> getGardenInfo(@RequestHeader String token, @PathVariable long gardenId) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 정원 조회");
            Long userId = jwtUtil.getId(token);

            ResponseGardenInfoDto returnData = gardenService.getGardenInfo(gardenId);
            response.put("gardenInfo", returnData);
            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 정원 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 가입 신청", description = "해당 정원에 가입신청한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 가입 신청 성공"),
            @ApiResponse(responseCode = "500", description = "정원 가입 신청 실패 - 내부 서버 오류"),
    })
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> joinGarden(@RequestHeader String token, @PathVariable long gardenId) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 정원 가입");
            Long userId = jwtUtil.getId(token);


            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 가입 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 정원 가입 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 가입 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
