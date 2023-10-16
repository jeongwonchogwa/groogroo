package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.dto.fruit.ResponseFruitDto;
import com.jwcg.groogroo.model.dto.tree.RequestTreeGenerationDto;
import com.jwcg.groogroo.model.dto.tree.RequestTreeModifyDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreeDto;
import com.jwcg.groogroo.model.entity.Fruit;
import com.jwcg.groogroo.model.entity.Tree;
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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
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

    private final JwtService jwtService;
    private final TreeService treeService;

    @Operation(summary = "메인 나무 생성", description = "해당 유저가 처음 그루그루에 접근했을 때 메인 나무를 생성할 때 사용되는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "메인 나무 생성 성공"),
            @ApiResponse(responseCode = "500", description = "메인 나무 생성 실패 - 내부 서버 오류"),
    })
    @PostMapping()
    public ResponseEntity<Map<String, Object>> makeMainTree(@RequestBody RequestTreeGenerationDto requestTreeGenerationDto) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 메인 나무 생성");
            treeService.makeMainTree(requestTreeGenerationDto.getUserId(), requestTreeGenerationDto.getImageUrl());

            response.put("httpStatus", SUCCESS);
            response.put("message", "메인 나무 생성 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 메인 나무 생성 실패");
            response.put("httpStatus", FAIL);

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "메인 나무 이미지 변경", description = "메인 나무의 이미지를 변경하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "메인 나무 이미지 변경 성공"),
            @ApiResponse(responseCode = "500", description = "메인 나무 이미지 변경 실패 - 내부 서버 오류"),
    })
    @PutMapping()
    public ResponseEntity<Map<String, Object>> modifyMainTreeImage(@RequestBody RequestTreeModifyDto requestTreeModifyDto) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 메인 나무 이미지 변경");
            treeService.modifyMainTreeImage(requestTreeModifyDto.getUserId(), requestTreeModifyDto.getImageUrl());

            response.put("httpStatus", SUCCESS);
            response.put("message", "메인 나무 이미지 변경 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 메인 나무 이미지 변경 실패");
            response.put("httpStatus", FAIL);

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "메인 나무 조회", description = "나무의 내용(열매)들을 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "메인 나무 조회 성공"),
            @ApiResponse(responseCode = "500", description = "메인 나무 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getMainTreeContents(@PathVariable long userId) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Tree Controller - 메인 나무 조회");

            Tree tree = treeService.getMainTreeContents(userId);
            ResponseTreeDto responseTreeDto = ResponseTreeDto.builder()
                    .id(tree.getId())
                    .imageUrl(tree.getImageUrl())
                    .build();

            List<ResponseFruitDto> fruits = new ArrayList<>();

            for (Fruit fruit : tree.getFruits()) {
                ResponseFruitDto now = ResponseFruitDto.builder()
                        .id(fruit.getId())
                        .writerId(fruit.getWriterId())
                        .content(fruit.getContent())
                        .x(fruit.getX())
                        .y(fruit.getY())
                        .type(fruit.getType())
                        .build();

                LocalDateTime cur = LocalDateTime.now();
                LocalDateTime target = fruit.getCreateTime();
                if (cur.isEqual(target)) {
                    now.setCreateTime(target.format(DateTimeFormatter.ofPattern("HH:MM")));
                }else {
                    now.setCreateTime(target.format(DateTimeFormatter.ofPattern("YY.MM.dd")));
                }

                fruits.add(now);
            }

            responseTreeDto.setFruits(fruits);

            response.put("tree", responseTreeDto);

            response.put("httpStatus", SUCCESS);
            response.put("message", "메인 나무 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Tree Controller - 메인 나무 조회 실패");
            response.put("httpStatus", FAIL);

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
