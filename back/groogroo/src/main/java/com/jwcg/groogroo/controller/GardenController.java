package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.exception.CustomException;
import com.jwcg.groogroo.model.dto.garden.*;
import com.jwcg.groogroo.model.service.GardenLikeService;
import com.jwcg.groogroo.model.service.GardenService;
import com.jwcg.groogroo.model.service.S3UploadService;
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
    private final S3UploadService s3UploadService;

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

            String url = gardenService.makeGarden(userId,
                    requestGardenGenerationDto.getName(),
                    requestGardenGenerationDto.getDescription(),
                    requestGardenGenerationDto.getCapacity());

            response.put("url", url);
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

    // TO DO: 랭킹 및 랭킹 목록 조회 : DONE

    /**
     * 좋아요 추가 API
     * Redis에 좋아요 정보를 추가한다. TTL(Time To Live) 가 만료되면 해당 데이터는 MySQL로 추가된다.
     * @param token
     * @param gardenId
     * @return -
     */
    @Operation(summary = "좋아요 추가", description = "사용자가 특정 정원에 좋아요를 표시한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 추가 성공"),
            @ApiResponse(responseCode = "500", description = "좋아요 추가 실패 - 내부 서버 오류"),
    })
    @PostMapping("/like/{gardenId}")
    public ResponseEntity<Map<String, Object>> addLikeToGarden(@RequestHeader("Authorization") String token, @PathVariable long gardenId) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 좋아요 추가");
            Long userId = jwtUtil.getId(token);

            gardenLikeService.likeGarden(userId, gardenId);
            response.put("httpStatus", SUCCESS);
            response.put("message", "좋아요 추가 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 좋아요 추가 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "좋아요 추가 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 좋아요 취소
     * Redis에 해당 좋아요 정보가 존재하면 삭제, MySQL에서 해당 좋아요 정보를 삭제한다.
     * @param token
     * @param gardenId
     * @return -
     */
    @Operation(summary = "좋아요 취소", description = "사용자가 좋아요를 표시한 정원의 좋아요를 취소한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 취소 성공"),
            @ApiResponse(responseCode = "500", description = "좋아요 취소 실패 - 내부 서버 오류"),
    })
    @DeleteMapping("/like/{gardenId}")
    public ResponseEntity<Map<String, Object>> cancelLikeToGarden(@RequestHeader("Authorization") String token, @PathVariable long gardenId) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 좋아요 취소");
            Long userId = jwtUtil.getId(token);

            gardenLikeService.cancelLikeGarden(userId, gardenId);
            response.put("httpStatus", SUCCESS);
            response.put("message", "좋아요 취소 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 좋아요 취소 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "좋아요 취소 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 좋아요 여부 조회
     * 사용자가 특정 정원에 대해서 좋아요를 표시했는 지 여부를 조회한다.
     * Redis에 해당 정보가 없고 MySQL에 존재한다면 최신화한다.
     * @param token
     * @param gardenId
     * @return -
     */
    @Operation(summary = "좋아요 여부 조회", description = "사용자가 특정 정원에 대해 좋아요를 표시했는 지 여부를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 여부 조회 성공"),
            @ApiResponse(responseCode = "500", description = "좋아요 여부 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/like/check/{gardenId}")
    public ResponseEntity<Map<String, Object>> isLikeGarden(@RequestHeader("Authorization") String token, @PathVariable long gardenId) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 좋아요 여부 조회");
            Long userId = jwtUtil.getId(token);

            boolean result = gardenLikeService.isLikeGarden(userId, gardenId);
            response.put("result", result);
            response.put("httpStatus", SUCCESS);
            response.put("message", "좋아요 여부 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 좋아요 여부 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "좋아요 여부 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 좋아요 개수 조회
     * 특정 정원의 좋아요 개수를 조회한다.
     * 항상 레디스에 해당 정원의 좋아요 정보를 최신화한다.
     * @param gardenId
     * @return {"count", long count}
     */
    @Operation(summary = "좋아요 개수 조회", description = "특정 정원의 총 좋아요 개수를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 개수 조회 성공"),
            @ApiResponse(responseCode = "500", description = "좋아요 개수 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/like/count/{gardenId}")
    public ResponseEntity<Map<String, Object>> getGardenLikes(@PathVariable long gardenId) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Garden Controller - 좋아요 개수 조회");

            long count = gardenLikeService.getGardenLikes(gardenId);
            response.put("count", count);
            response.put("httpStatus", SUCCESS);
            response.put("message", "좋아요 개수 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 좋아요 개수 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "좋아요 개수 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 좋아요 랭킹 목록 조회
     * 파라미터의 페이지의 좋아요 랭킹을 10개씩 반환한다.
     * @param token
     * @param page 0부터 시작
     * @return Page<ResponseGardenRankingDto> ranking
     */
    @Operation(summary = "좋아요 랭킹 목록 조회", description = "모든 정원 중 좋아요 개수가 많은 순서대로 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 랭킹 목록 조회 성공"),
            @ApiResponse(responseCode = "500", description = "좋아요 랭킹 목록 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/like/ranking/{page}")
    public ResponseEntity<Map<String, Object>> getGardenLikes(@RequestHeader("Authorization") String token, @PathVariable int page) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            long userId = jwtUtil.getId(token);
            log.info("Garden Controller - 좋아요 랭킹 목록 조회");

            Page<ResponseGardenRankingDto> responseGardenRankingDtos = gardenLikeService.getGardenRankingByPagination(userId, page);
            response.put("ranking", responseGardenRankingDtos);
            response.put("httpStatus", SUCCESS);
            response.put("message", "좋아요 랭킹 목록 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Garden Controller - 좋아요 랭킹 목록 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "좋아요 랭킹 목록 조회 실패");

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

    @Operation(summary = "정원에 나무 생성 및 배치", description = "정원에 나무 생성하고 배치하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "정원에 나무 생성 및 배치 성공"),
            @ApiResponse(responseCode = "500", description = "정원에 나무 생성 및 배치 실패 - 내부 서버 오류"),
    })
    @PostMapping("/tree")
    public ResponseEntity<Map<String, Object>> plantTree(@RequestHeader("Authorization") String token, @RequestBody RequestCreateTreeGardenDto request) {
        Map<String,Object> response = new HashMap<>();

        try {
            token = token.split(" ")[1];
            Long userId = jwtUtil.getId(token);
            
            if(!request.isPreset()){
                // 프리셋이 아니면 이미지 S3에 저장하기
                s3UploadService.upload(request.getImageUrl(), userId.toString()+"groogroo"+request.getGardenId().toString(), "tree");
                log.info("이미지 S3에 저장 성공");
            }
            
            log.info("정원에 나무 생성 및 배치");
            gardenService.createTreeGarden(userId, request.getGardenId(), request.getImageUrl(), request.getX(), request.getY());
            log.info("정원에 나무 생성 및 배치 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "정원에 나무 생성 및 배치 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.info("정원에 나무 생성 및 배치 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "정원에 나무 생성 및 배치 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "정꾸!(정원 꾸미기)", description = "정원의 꽃과 나무 제배치하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "꽃 & 나무 재배치 성공"),
            @ApiResponse(responseCode = "500", description = "꽃 & 나무 재배치 실패 - 내부 서버 오류"),
    })
    @PostMapping("/decoration")
    public ResponseEntity<Map<String, Object>> replaceFlowersAndTrees(@RequestHeader("Authorization") String token, @RequestBody RequestReplaceFlowersAndTreesDto request) {
        Map<String,Object> response = new HashMap<>();

        try {
            token = token.split(" ")[1];
            Long userId = jwtUtil.getId(token);

            log.info("꽃 & 나무 재배치");
            gardenService.updateFlowersAndTrees(request);
            log.info("꽃 & 나무 재배치 성공");
            response.put("httpStatus", SUCCESS);
            response.put("message", "꽃 & 나무 재배치 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.info("꽃 & 나무 재배치 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "꽃 & 나무 재배치 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
