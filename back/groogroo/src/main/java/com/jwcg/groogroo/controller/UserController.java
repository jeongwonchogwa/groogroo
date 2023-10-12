package com.jwcg.groogroo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Tag(name = "User", description = "User API")
@RequestMapping("/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class UserController {

    // 참고용 - 나중에 지우기
//    @Operation(summary = "미션 목록", description = "미션 목록 불러오는 API")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "미션 불러오기 성공"),
//            @ApiResponse(responseCode = "500", description = "미션 불러오기 실패 - 서버 오류")
//    })
//    @GetMapping()
//    public ResponseEntity<?> getMissionList(@PageableDefault(size = 6, sort = "missionCreationTime", direction = Sort.Direction.DESC) Pageable pageable) {
//        log.info("미션 목록 불러오기");
//        try {
//            List<MissionListResponse> list = missionService.getMissionList(pageable);
//            log.info("미션 불러오기 성공");
//
//            return new ResponseEntity<List<MissionListResponse>>(list, HttpStatus.OK);
//        } catch (Exception e) {
//            log.info("미션 불러오기 실패 - 서버 오류");
//            return new ResponseEntity<String>(FAIL, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
    
}
