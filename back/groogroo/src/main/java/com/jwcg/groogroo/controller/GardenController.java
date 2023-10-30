package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.exception.CustomException;
import com.jwcg.groogroo.model.dto.garden.*;
import com.jwcg.groogroo.model.service.GardenLikeService;
import com.jwcg.groogroo.model.service.GardenService;
import com.jwcg.groogroo.util.JwtUtil;
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
import java.util.List;
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
    private final GardenLikeService gardenLikeService;

    @Operation(summary = "정원 생성", description = "정원을 새로 생성하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 생성 성공"),
            @ApiResponse(responseCode = "500", description = "정원 생성 실패 - 내부 서버 오류"),
    })
    @PostMapping()
    public ResponseEntity<Map<String, Object>> makeGarden(@RequestHeader("Authorization") String token, @RequestBody RequestGardenGenerationDto requestGardenGenerationDto) {
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
                    requestGardenGenerationDto.getImageUrl(),
                    requestGardenGenerationDto.getCapacity());

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
    public ResponseEntity<Map<String, Object>> getGardenInfo(@RequestHeader("Authorization") String token, @PathVariable long gardenId) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 정원 조회");
            Long userId = jwtUtil.getId(token);

            ResponseGardenInfoDto returnData = gardenService.getGardenInfo(userId, gardenId);
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

    @Operation(summary = "소속 정원 목록 조회", description = "사용자가 속해있는 정원의 목록을 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "소속 정원 목록 조회 성공"),
            @ApiResponse(responseCode = "500", description = "소속 정원 목록 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/list/{page}")
    public ResponseEntity<Map<String, Object>> getUserGarden(@RequestHeader("Authorization") String token, @PathVariable int page) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 소속 정원 목록 조회");
            Long userId = jwtUtil.getId(token);

            Page<ResponseUserGardenDto> returnData = gardenService.getUserGardenByPagination(userId, page);
            response.put("gardenInfo", returnData);
            response.put("httpStatus", SUCCESS);
            response.put("message", "소속 정원 목록 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 소속 정원 목록 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "소속 정원 목록 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 마스터 권한 지정", description = "정원 마스터가 다른 소속 인원의 등급을 변경한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 마스터 권한 지정 성공"),
            @ApiResponse(responseCode = "500", description = "정원 마스터 권한 지정 실패 - 내부 서버 오류"),
    })
    @PatchMapping("/master")
    public ResponseEntity<Map<String, Object>> changeRoleFromMaster(@RequestHeader("Authorization") String token, @RequestBody RequestGardenRoleDto requestGardenRoleDto) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 정원 마스터 권한 지정");
            Long userId = jwtUtil.getId(token);

            gardenService.changeRoleFromMaster(userId,
                    requestGardenRoleDto.getRole(),
                    requestGardenRoleDto.getGardenId(),
                    requestGardenRoleDto.getTargetId());

            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 마스터 권한 지정 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 정원 마스터 권한 지정 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 마스터 권한 지정 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 초대 링크 조회", description = "사용자가 초대하고자 하는 정원의 링크를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 초대 링크 조회 성공"),
            @ApiResponse(responseCode = "500", description = "정원 초대 링크 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/invite/{gardenId}")
    public ResponseEntity<Map<String, Object>> getGardenLink(@PathVariable long gardenId) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 정원 초대 링크 조회");

            String URL = gardenService.getGardenLink(gardenId);
            response.put("url", URL);
            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 초대 링크 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 정원 초대 링크 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 초대 링크 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 가입 신청", description = "해당 정원에 가입신청하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 가입 신청 성공"),
            @ApiResponse(responseCode = "500", description = "정원 가입 신청 실패 - 내부 서버 오류"),
    })
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> joinGarden(@RequestHeader("Authorization") String token, @RequestBody long gardenId) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("정원 가입");
            Long userId = jwtUtil.getId(token);
            gardenService.joinGarden(userId, gardenId);

            log.info("정원 가입 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 가입 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (CustomException e) {
            log.info(e.getMessage());
            response.put("httpStatus", FAIL);
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, e.getHttpStatus());
        } catch (Exception e) {
            log.info("정원 가입 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 가입 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 가입 처리", description = "가입 신청에 대해 승인 / 거절 하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 가입 처리 성공"),
            @ApiResponse(responseCode = "500", description = "정원 가입 처리 실패 - 내부 서버 오류"),
    })
    @PatchMapping("/process")
    public ResponseEntity<Map<String, Object>> handleJoin(@RequestHeader("Authorization") String token, @RequestBody RequestUpdateJoinStateDto request) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("정원 가입 처리");

            gardenService.updateOthersJoinState(token, request.getUserId(), request.getGardenId(), request.getJoinState());

            log.info("정원 가입 처리 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 가입 처리 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (CustomException e) {
            log.info(e.getMessage());
            response.put("httpStatus", FAIL);
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, e.getHttpStatus());
        } catch (Exception e) {
            log.info("정원 가입 처리 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 가입 처리 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 가입 결과 조회", description = "정원 가입 결과를 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 가입 결과 조회 성공"),
            @ApiResponse(responseCode = "500", description = "정원 가입 결과 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/process")
    public ResponseEntity<Map<String, Object>> getJoinResult(@RequestHeader("Authorization") String token) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("정원 가입 결과 조회");
            token = token.split(" ")[1];
            Long userId = jwtUtil.getId(token);

            List<ResponseUserGardenDto> list = gardenService.getGardenJoinStateList(userId);

            log.info("정원 가입 결과 조회 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 가입 결과 조회 성공");
            response.put("gardenList", list);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.info("정원 가입 결과 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 가입 결과 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정원 탈퇴", description = "정원에서 탈퇴하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원 탈퇴 성공"),
            @ApiResponse(responseCode = "500", description = "정원 탈퇴 실패 - 내부 서버 오류"),
    })
    @PatchMapping("/withdrawal")
    public ResponseEntity<Map<String, Object>> withdrawFromGarden(@RequestHeader("Authorization") String token, @RequestBody Long gardenId) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("정원 탈퇴");
            token = token.split(" ")[1];
            Long userId = jwtUtil.getId(token);

            gardenService.withdrawFromGarden(userId, gardenId);

            log.info("정원 탈퇴 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "정원 탈퇴 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (CustomException e) {
            log.info(e.getMessage());
            response.put("httpStatus", FAIL);
            response.put("message", e.getMessage());

            return new ResponseEntity<>(response, e.getHttpStatus());
        } catch (Exception e) {
            log.info("정원 탈퇴 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원 탈퇴 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
