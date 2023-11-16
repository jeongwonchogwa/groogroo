package com.jwcg.groogroo.model.service;


import com.jwcg.groogroo.model.dto.flower.ResponseSimpleFlowerDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@AllArgsConstructor
public class FlowerService {

    private final NotificationService notificationService;

    private final UserGardenRepository userGardenRepository;
    private final FlowerRepository flowerRepository;
    private final PresetRepository presetRepository;
    private final GardenRepository gardenRepository;


    public void makeFlower(long userId, long gardenId, String writerNickname, String imageUrl, String content, int x, int y ){
        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        Flower flower = Flower.builder()
                .userGarden(userGarden)
                .content(content)
                .createTime(LocalDateTime.now())
                .writerNickname(writerNickname)
                .imageUrl(imageUrl)
                .x(x)
                .y(y)
                .build();

        // userGarden 객체의 flowers 리스트에 flower 추가
        userGarden.getFlowers().add(flower);

        flowerRepository.save(flower);

        // 정원 소속 인원들에게 알림 발송
        List<UserGarden> members = userGardenRepository.findAllByGardenId(gardenId);
        // 본인 제거
        members.removeIf(member -> member.getUser().getId() == userId);

        String msg = "정원에 새로운 꽃이 심어졌습니다. 확인 해보세요.";
        Garden garden = gardenRepository.findGardenById(gardenId);
        for (UserGarden member : members) {
            if (member.getJoinState().toString().equals("WAIT")) continue;
            long receiverId = member.getUser().getId();
            Notification notification = notificationService.makeNotification(receiverId, gardenId, flower.getId(), msg, NotificationType.FLOWER, garden.getName());
            notificationService.send(member.getId(), notification);
        }
    }

    public void deleteFlower(long flowerId){
        Flower flower = flowerRepository.findFlowerById(flowerId);
        UserGarden userGarden = flower.getUserGarden();
        GardenRole gardenRole = userGarden.getGardenRole();
        LocalDateTime currentTime = LocalDateTime.now();
        long minutesSinceCreation = ChronoUnit.MINUTES.between(flower.getCreateTime(), currentTime);
        if(flower == null){throw new ResponseStatusException(HttpStatus.NO_CONTENT);}
        if(!gardenRole.equals(GardenRole.ADMIN) && minutesSinceCreation > 5){throw new ResponseStatusException(HttpStatus.FORBIDDEN);}
        userGarden.getFlowers().remove(flower);
        flowerRepository.delete(flower);
    }

    public Flower getFlowerContent(long flowerId){
        return flowerRepository.findFlowerById(flowerId);
    }



    @Transactional(readOnly = true)
    public List<Preset> getFlowerPreset() {
        return presetRepository.findAllByContentType(ContentType.FLOWER);
    }


    public ResponseSimpleFlowerDto getSimpleFlowerContent(Long flowerId) {
        Flower flower = flowerRepository.findFlowerById(flowerId);
        ResponseSimpleFlowerDto simpleFlowerDto = ResponseSimpleFlowerDto.builder()
                .id(flower.getId())
                .content(flower.getContent())
                .writerNickname(flower.getWriterNickname())
                .build();
        return simpleFlowerDto;
    }
}
