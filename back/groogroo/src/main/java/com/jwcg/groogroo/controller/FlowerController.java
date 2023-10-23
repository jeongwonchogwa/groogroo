package com.jwcg.groogroo.controller;


import com.jwcg.groogroo.model.dto.flower.RequestFlowerGenerationDto;
import com.jwcg.groogroo.model.dto.flower.ResponseFlowerDto;
import com.jwcg.groogroo.model.entity.Flower;
import com.jwcg.groogroo.model.service.FlowerService;
import com.jwcg.groogroo.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name="Flower", description = "꽃 관련 API")
@RequestMapping("/flower")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
@Slf4j
public class FlowerController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final JwtUtil jwtUtil;
    private final FlowerService flowerService;

    @Operation(summary = "꽃 생성", description = "꽃 생성하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "꽃 심기 성공"),
            @ApiResponse(responseCode = "500", description = "꽃 심기 실패 - 서버 오류")
    })
    @PostMapping()
    public ResponseEntity<Map<String, Object>> makeFlower(@RequestHeader("Authorization") String token, @RequestBody RequestFlowerGenerationDto requestFlowerGenerationDto){
        token = token.split(" ")[1];
        Map<String, Object> response = new HashMap<>();

        try{
            Long userId = jwtUtil.getId(token);
            flowerService.makeFlower(userId, requestFlowerGenerationDto.getGardenId(), requestFlowerGenerationDto.getWriterNickname(), requestFlowerGenerationDto.getImageUrl(), requestFlowerGenerationDto.getContent(), requestFlowerGenerationDto.getX(), requestFlowerGenerationDto.getY());

            response.put("httpStatus", SUCCESS);
            response.put("message", "꽃 생성 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("httpStatus", FAIL);
            response.put("message", "꽃 생성 실패");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "꽃 삭제", description = "특정 꽃을 삭제할 때 사용되는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "꽃 삭제 성공"),
            @ApiResponse(responseCode = "500", description = "꽃 삭제 실패 - 내부 서버 오류"),
    })
    @DeleteMapping("/{flowerId}")
    public ResponseEntity<Map<String, Object>> deleteFlower(@RequestHeader("Authorization") String token, @PathVariable long flowerId){
        Map<String, Object> response = new HashMap<>();
        token = token.split(" ")[1];
        try {
            log.info("Flower Controller - 꽃 삭제");
            Long userId = jwtUtil.getId(token);
            flowerService.deleteFlower(flowerId);
            log.info("flower 정보 {}", flowerId);

            response.put("httpStatus", SUCCESS);
            response.put("message", "꽃 삭제 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.info("Flower Controller - 꽃 삭제 실패");
            log.info(e.getMessage());
            response.put("httpStatus", FAIL);
            response.put("message", "꽃 삭제 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "꽃 상세", description = "특정 꽃을 상세하게 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "꽃 상세 조회 성공"),
            @ApiResponse(responseCode = "500", description = "꽃 상세 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/{flowerId}")
    public ResponseEntity<Map<String, Object>> getFlowerContent(@PathVariable long flowerId){
        Map<String, Object> response = new HashMap<>();

        try {
            log.info("Flower Controller - 꽃 상세 조회");
            Flower flower = flowerService.getFlowerContent(flowerId);
            log.info("Flower {}", flower);
            ResponseFlowerDto responseFlowerDto = ResponseFlowerDto.builder()
                    .id(flower.getId())
                    .writerId(flower.getUserGarden().getUser().getId())
                    .writerNickName(flower.getWriterNickname())
                    .content(flower.getContent())
                    .imageUrl(flower.getImageUrl())
                    .build();

            LocalDateTime cur = LocalDateTime.now();
            LocalDateTime target = flower.getCreateTime();
            if (cur.toLocalDate().isEqual(target.toLocalDate())) {
                // set보단 build를 써보아요
                responseFlowerDto.setCreateTime(target.format(DateTimeFormatter.ofPattern("HH:mm")));
            }else {
                responseFlowerDto.setCreateTime(target.format(DateTimeFormatter.ofPattern("YY.MM.dd")));
            }

            response.put("flower", responseFlowerDto);
            response.put("httpStatus", SUCCESS);
            response.put("message", "꽃 상세 조회 성공");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.info("Flower Controller - 꽃 상세 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "꽃 상세 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

