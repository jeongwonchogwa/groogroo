package com.jwcg.groogroo;

import com.jwcg.groogroo.model.entity.Notification;
import com.jwcg.groogroo.model.entity.NotificationType;
import com.jwcg.groogroo.repository.EmitterRepository;
import com.jwcg.groogroo.repository.EmitterRepositoryImpl;
import com.jwcg.groogroo.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@SpringBootTest
@WebAppConfiguration
public class EmitterTests {


    private EmitterRepository emitterRepository = new EmitterRepositoryImpl();

    @Autowired
    private UserRepository userRepository;
    private Long DEFAULT_TIMEOUT = 60L * 1000L * 60L;

    @Test
    @DisplayName("새로운 Emitter를 추가한다.")
    public void save() throws Exception {
        //given
        Long memberId = 1L;
        String emitterId =  memberId + "_" + System.currentTimeMillis();
        SseEmitter sseEmitter = new SseEmitter(DEFAULT_TIMEOUT);

        //when, then
        Assertions.assertDoesNotThrow(() -> emitterRepository.save(emitterId, sseEmitter));
    }

    @Test
    @DisplayName("수신한 이벤트를 캐시에 저장한다.")
    public void saveEventCache() throws Exception {
        //given
        Long memberId = 1L;
        String eventCacheId =  memberId + "_" + System.currentTimeMillis();
        Notification notification = Notification.builder()
                .notificationType(NotificationType.GARDEN)
                .content("정원 가입 신청이 왔습니다.")
                .receiver(userRepository.findUserById(memberId))
                .gardenId(1L)
                .contentId(1L)
                .isRead(false)
                .build();

        //when, then
        Assertions.assertDoesNotThrow(() -> emitterRepository.saveEventCache(eventCacheId, notification));
    }

    @Test
    @DisplayName("어떤 회원이 접속한 모든 Emitter를 찾는다")
    public void findAllEmitterStartWithByMemberId() throws Exception {
        //given
        Long memberId = 1L;
        String emitterId1 = memberId + "_" + System.currentTimeMillis();
        emitterRepository.save(emitterId1, new SseEmitter(DEFAULT_TIMEOUT));

        Thread.sleep(100);
        String emitterId2 = memberId + "_" + System.currentTimeMillis();
        emitterRepository.save(emitterId2, new SseEmitter(DEFAULT_TIMEOUT));

        Thread.sleep(100);
        String emitterId3 = memberId + "_" + System.currentTimeMillis();
        emitterRepository.save(emitterId3, new SseEmitter(DEFAULT_TIMEOUT));


        //when
        Map<String, SseEmitter> ActualResult = emitterRepository.findAllEmitterStartWithById(String.valueOf(memberId));

        //then
        Assertions.assertEquals(3, ActualResult.size());
    }

    @Test
    @DisplayName("어떤 회원에게 수신된 이벤트를 캐시에서 모두 찾는다.")
    public void findAllEventCacheStartWithByMemberId() throws Exception {
        //given
        Long memberId = 1L;
        String eventCacheId1 =  memberId + "_" + System.currentTimeMillis();

        Notification notification1 = Notification.builder()
                .notificationType(NotificationType.GARDEN)
                .content("정원 가입 신청이 왔습니다. 1번")
                .receiver(userRepository.findUserById(memberId))
                .gardenId(1L)
                .contentId(1L)
                .isRead(false)
                .build();

        emitterRepository.saveEventCache(eventCacheId1, notification1);

        Thread.sleep(100);
        String eventCacheId2 =  memberId + "_" + System.currentTimeMillis();

        Notification notification2 = Notification.builder()
                .notificationType(NotificationType.GARDEN)
                .content("정원 가입 신청이 왔습니다. 2번")
                .receiver(userRepository.findUserById(memberId))
                .gardenId(1L)
                .contentId(1L)
                .isRead(false)
                .build();
        emitterRepository.saveEventCache(eventCacheId2, notification2);

        Thread.sleep(100);
        String eventCacheId3 =  memberId + "_" + System.currentTimeMillis();

        Notification notification3 = Notification.builder()
                .notificationType(NotificationType.GARDEN)
                .content("정원 가입 신청이 왔습니다. 2번")
                .receiver(userRepository.findUserById(memberId))
                .gardenId(1L)
                .contentId(1L)
                .isRead(false)
                .build();
        emitterRepository.saveEventCache(eventCacheId3, notification3);

        //when
        Map<String, Object> ActualResult = emitterRepository.findAllEventCacheStartWithById(String.valueOf(memberId));

        //then
        Assertions.assertEquals(3, ActualResult.size());
    }

    @Test
    @DisplayName("ID를 통해 Emitter를 Repository에서 제거한다.")
    public void deleteById() throws Exception {
        //given
        Long memberId = 1L;
        String emitterId =  memberId + "_" + System.currentTimeMillis();
        SseEmitter sseEmitter = new SseEmitter(DEFAULT_TIMEOUT);

        //when
        emitterRepository.save(emitterId, sseEmitter);
        emitterRepository.deleteById(emitterId);

        //then
        Assertions.assertEquals(0, emitterRepository.findAllEmitterStartWithById(emitterId).size());
    }

    @Test
    @DisplayName("저장된 모든 Emitter를 제거한다.")
    public void deleteAllEmitterStartWithId() throws Exception {
        //given
        Long memberId = 1L;
        String emitterId1 = memberId + "_" + System.currentTimeMillis();
        emitterRepository.save(emitterId1, new SseEmitter(DEFAULT_TIMEOUT));

        Thread.sleep(100);
        String emitterId2 = memberId + "_" + System.currentTimeMillis();
        emitterRepository.save(emitterId2, new SseEmitter(DEFAULT_TIMEOUT));

        //when
        emitterRepository.deleteAllEmitterStartWithId(String.valueOf(memberId));

        //then
        Assertions.assertEquals(0, emitterRepository.findAllEmitterStartWithById(String.valueOf(memberId)).size());
    }

    @Test
    @DisplayName("수신한 이벤트를 캐시에 저장한다.")
    public void deleteAllEventCacheStartWithId() throws Exception {
        //given
        Long memberId = 1L;
        String eventCacheId1 =  memberId + "_" + System.currentTimeMillis();
        Notification notification1 = Notification.builder()
                .notificationType(NotificationType.GARDEN)
                .content("정원 가입 신청이 왔습니다. 1번")
                .receiver(userRepository.findUserById(memberId))
                .gardenId(1L)
                .contentId(1L)
                .isRead(false)
                .build();
        emitterRepository.saveEventCache(eventCacheId1, notification1);

        Thread.sleep(100);
        String eventCacheId2 =  memberId + "_" + System.currentTimeMillis();
        Notification notification2 = Notification.builder()
                .notificationType(NotificationType.GARDEN)
                .content("정원 가입 신청이 왔습니다. 2번")
                .receiver(userRepository.findUserById(memberId))
                .gardenId(1L)
                .contentId(1L)
                .isRead(false)
                .build();
        emitterRepository.saveEventCache(eventCacheId2, notification2);

        //when
        emitterRepository.deleteAllEventCacheStartWithId(String.valueOf(memberId));

        //then
        Assertions.assertEquals(0, emitterRepository.findAllEventCacheStartWithById(String.valueOf(memberId)).size());
    }
}
