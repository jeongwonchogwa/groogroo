package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.notification.ResponseNotificationDto;
import com.jwcg.groogroo.model.entity.Notification;
import com.jwcg.groogroo.model.entity.NotificationType;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.repository.EmitterRepository;
import com.jwcg.groogroo.repository.NotificationRepository;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@AllArgsConstructor
public class NotificationService {
    private static final Long DEFAULT_TIMEOUT = 120L * 1000 * 60;

    private final EmitterRepository emitterRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public SseEmitter subscribe(Long userId, String lastEventId) {

        // 마지막 수신 이벤트를 구분하기 위해 userId 뒤에 구분자와 현재시각을 넣어준다.
        String id = userId + "_" + System.currentTimeMillis();

        SseEmitter emitter = emitterRepository.save(id, new SseEmitter(DEFAULT_TIMEOUT));

        emitter.onCompletion(() -> emitterRepository.deleteById(id));
        emitter.onTimeout(() -> emitterRepository.deleteById(id));

        // 503 에러를 방지하기 위한 더미 이벤트 전송
        sendToClient(emitter, id, "EventStream Created. [userId=" + userId + "]");

        // 클라이언트가 미수신한 Event 목록이 존재할 경우 전송하여 Event 유실을 예방
        if (!lastEventId.isEmpty()) {
            Map<String, Object> events = emitterRepository.findAllEventCacheStartWithById(String.valueOf(userId));
            events.entrySet().stream()
                    .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                    .forEach(entry -> sendToClient(emitter, entry.getKey(), entry.getValue()));
        }

        return emitter;
    }

    public void send(long receiverId, Notification notification) {
        String userId = String.valueOf(receiverId);

        // 로그인 한 유저의 SseEmitter 모두 가져오기
        Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithById(userId);
        sseEmitters.forEach(
                (key, emitter) -> {
                    // 데이터 캐시 저장(유실된 데이터 처리하기 위함)
                    emitterRepository.saveEventCache(key, notification);
                    // 데이터 전송
                    sendToClient(emitter, key, transformEntityToDto(notification));
                }
        );
    }

    private void sendToClient(SseEmitter emitter, String id, Object data) {
        try {
            emitter.send(SseEmitter.event()
                    .id(id)
                    .name("sse")
                    .data(data));
        } catch (IOException exception) {
            emitterRepository.deleteById(id);
            throw new RuntimeException("연결 오류!");
        }
    }

    public Notification makeNotification(Long receiverId, Long gardenId, Long contentId, String content, NotificationType notificationType, String name) {
        User receiver = userRepository.findUserById(receiverId);

        Notification notification = Notification.builder()
                .name(name)
                .contentId(contentId)
                .gardenId(gardenId)
                .content(content)
                .notificationType(notificationType)
                .receiver(receiver)
                .isRead(false)
                .createTime(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<ResponseNotificationDto> getNotifications(long userId) {
        List<ResponseNotificationDto> returnData = new ArrayList<>();
        List<Notification> notifications = notificationRepository.findAllByReceiverId(userId);

        for (Notification notification : notifications) {
            ResponseNotificationDto responseNotificationDto = transformEntityToDto(notification);

            returnData.add(responseNotificationDto);
        }

        return returnData;
    }

    public void readNotification(long notificationId) {
        Notification find = notificationRepository.findNotificationById(notificationId);

        find.setRead(true);

        notificationRepository.save(find);
    }

    public ResponseNotificationDto transformEntityToDto(Notification notification) {
        return ResponseNotificationDto.builder()
                .id(notification.getId())
                .gardenId(notification.getGardenId())
                .contentId(notification.getContentId())
                .isRead(notification.isRead())
                .type(notification.getNotificationType().toString())
                .content(notification.getContent())
                .build();
    }

}