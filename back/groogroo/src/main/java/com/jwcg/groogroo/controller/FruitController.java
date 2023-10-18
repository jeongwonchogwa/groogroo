package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.dto.fruit.RequestFruitDeleteDto;
import com.jwcg.groogroo.model.dto.fruit.RequestFruitGenerationDto;
import com.jwcg.groogroo.model.dto.fruit.ResponseFruitDto;
import com.jwcg.groogroo.model.dto.fruit.ResponseFruitPresetDto;
import com.jwcg.groogroo.model.entity.Fruit;
import com.jwcg.groogroo.model.entity.Preset;
import com.jwcg.groogroo.model.service.FruitService;
import com.jwcg.groogroo.model.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "fruit", description = "열매 관련 API")
@RequestMapping("/fruit")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
@Slf4j
public class FruitController {
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final JwtService jwtService;
    private final FruitService fruitService;

    @Operation(summary = "열매 생성", description = "특정 나무에 열매를 생성할 때 사용되는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "열매 생성 성공"),
            @ApiResponse(responseCode = "500", description = "열매 생성 실패 - 내부 서버 오류"),
    })
    @PostMapping()
    public ResponseEntity<Map<String, Object>> makeFruit(@RequestHeader String token, @RequestBody RequestFruitGenerationDto requestFruitGenerationDto) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Fruit Controller - 열매 생성");
            Long userId = jwtService.extractUserId(token);

            fruitService.makeFruit(userId,
                    requestFruitGenerationDto.getTreeId(),
                    requestFruitGenerationDto.getWriterNickname(),
                    requestFruitGenerationDto.getImageUrl(),
                    requestFruitGenerationDto.getContent());

            response.put("httpStatus", SUCCESS);
            response.put("message", "열매 생성 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Fruit Controller - 열매 생성 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "열매 생성 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "열매 삭제", description = "특정 열매를 삭제할 때 사용되는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "열매 삭제 성공"),
            @ApiResponse(responseCode = "500", description = "열매 삭제 실패 - 내부 서버 오류"),
    })
    @DeleteMapping()
    public ResponseEntity<Map<String, Object>> deleteFruit(@RequestBody RequestFruitDeleteDto requestFruitDeleteDto) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Fruit Controller - 열매 삭제");

            fruitService.deleteFruit(requestFruitDeleteDto.getTreeId(),
                    requestFruitDeleteDto.getFruitId());

            response.put("httpStatus", SUCCESS);
            response.put("message", "열매 삭제 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Fruit Controller - 열매 삭제 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "열매 삭제 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "열매 프리셋 조회", description = "열매를 생성할 때 선택할 프리셋을 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "열매 프리셋 조회 성공"),
            @ApiResponse(responseCode = "500", description = "열매 프리셋 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping()
    public ResponseEntity<Map<String, Object>> getFruitPreset() {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Fruit Controller - 열매 프리셋 조회");
            List<Preset> presets = fruitService.getFruitPreset();
            List<ResponseFruitPresetDto> returnData = new ArrayList<>();

            for (Preset preset : presets) {
                ResponseFruitPresetDto responseFruitPresetDto = ResponseFruitPresetDto.builder()
                        .imageUrl(preset.getImageUrl())
                        .build();

                returnData.add(responseFruitPresetDto);
            }

            response.put("presets", returnData);
            response.put("httpStatus", SUCCESS);
            response.put("message", "열매 프리셋 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Fruit Controller - 열매 프리셋 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "열매 프리셋 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "열매 상세 조회", description = "열매를 상세하게 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "열매 상세 조회 성공"),
            @ApiResponse(responseCode = "500", description = "열매 상세 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/{fruitId}")
    public ResponseEntity<Map<String, Object>> getFruitContent(@PathVariable long fruitId) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Fruit Controller - 열매 상세 조회");
            Fruit fruit = fruitService.getFruitContent(fruitId);
            ResponseFruitDto responseFruitDto = ResponseFruitDto.builder()
                    .id(fruit.getId())
                    .writerId(fruit.getWriterId())
                    .writerNickname(fruit.getWriterNickname())
                    .content(fruit.getContent())
                    .imageUrl(fruit.getImageUrl())
                    .build();

            LocalDateTime cur = LocalDateTime.now();
            LocalDateTime target = fruit.getCreateTime();
            if (cur.toLocalDate().isEqual(target.toLocalDate())) {
                responseFruitDto.setCreateTime(target.format(DateTimeFormatter.ofPattern("HH:MM")));
            }else {
                responseFruitDto.setCreateTime(target.format(DateTimeFormatter.ofPattern("YY.MM.dd")));
            }

            response.put("fruit", responseFruitDto);
            response.put("httpStatus", SUCCESS);
            response.put("message", "열매 상세 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Fruit Controller - 열매 상세 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "열매 상세 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
