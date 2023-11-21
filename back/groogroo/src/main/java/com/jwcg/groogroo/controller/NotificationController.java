package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.model.dto.garden.RequestGardenGenerationDto;
import com.jwcg.groogroo.model.dto.garden.ResponseUserGardenDto;
import com.jwcg.groogroo.model.dto.notification.ResponseNotificationDto;
import com.jwcg.groogroo.model.service.NotificationService;
import com.jwcg.groogroo.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@Tag(name = "notification", description = "실시간 알림 관련 API")
@RequestMapping("/notification")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
@AllArgsConstructor
public class NotificationController {
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;

    /**
     * 로그인 한 유저 sse 연결
     */
    @Operation(summary = "알림 구독", description = "로그인 상태의 유저가 알림을 구독하는 API")
    @GetMapping(value = "/subscribe/{userId}", produces = "text/event-stream")
    public SseEmitter subscribe(@RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId, @PathVariable long userId) {

        log.info("Notification Controller - 알림 구독");

        return notificationService.subscribe(userId, lastEventId);
    }


    /**
     * 사용자에게 온 알림들의 목록을 DB에서 읽어온다.
     */
    @Operation(summary = "알림 목록 조회", description = "사용자에게 온 알림들의 목록을 조회하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "알림 목록 조회 성공"),
            @ApiResponse(responseCode = "500", description = "알림 목록 조회 실패 - 내부 서버 오류"),
    })
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getNotifications(@RequestHeader("Authorization") String token) {
        token = token.split(" ")[1];
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Notification Controller - 알림 목록 조회");
            Long userId = jwtUtil.getId(token);

            List<ResponseNotificationDto> returnData = notificationService.getNotifications(userId);
            response.put("gardenInfo", returnData);
            response.put("httpStatus", SUCCESS);
            response.put("message", "알림 목록 조회 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Notification Controller - 알림 목록 조회 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "알림 목록 조회 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사용자가 선택한 알림에 대해 읽음 처리를 한다.
     *
     */
    @Operation(summary = "알림 읽음 처리", description = "해당 알림을 읽음 처리하는 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "알림 읽음 처리 성공"),
            @ApiResponse(responseCode = "500", description = "알림 읽음 처리 실패 - 내부 서버 오류"),
    })
    @PatchMapping("/read/{notificationId}")
    public ResponseEntity<Map<String, Object>> readNotification(@PathVariable long notificationId) {
        Map<String,Object> response = new HashMap<>();

        try {
            log.info("Notification Controller - 알림 읽음 처리");

            notificationService.readNotification(notificationId);
            response.put("httpStatus", SUCCESS);
            response.put("message", "알림 읽음 처리 성공");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e) {
            log.info("Notification Controller - 알림 읽음 처리 실패");
            response.put("httpStatus", FAIL);
            response.put("message", "알림 읽음 처리 실패");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * 유저에게 이벤트 발생 데이터 전달
     */
//    @Operation(summary = "알림 전송", description = "유저에게 알림을 전송하는 API")
//    @PostMapping("/send-data")
//    public void sendData(@RequestHeader("Authorization") String token) {
//        token = token.split(" ")[1];
//        long userId = jwtUtil.getId(token);
//
//        notificationService.notify(userId, "data");
//    }
}