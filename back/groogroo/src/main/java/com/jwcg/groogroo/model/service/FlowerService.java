package com.jwcg.groogroo.model.service;


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

@Service
@Slf4j
@AllArgsConstructor
public class FlowerService {

    private final UserGardenRepository userGardenRepository;
    private final FlowerRepository flowerRepository;
    private final PresetRepository presetRepository;


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
    }

    public void deleteFlower(long flowerId, long userId){
        Flower flower = flowerRepository.findFlowerById(flowerId);
        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndFlowerId(userId, flowerId);
        UserRole userRole = flower.getUserGarden().getUser().getUserRole();
        LocalDateTime currentTime = LocalDateTime.now();
        long minutesSinceCreation = ChronoUnit.MINUTES.between(flower.getCreateTime(), currentTime);
        if(flower == null){throw new ResponseStatusException(HttpStatus.NO_CONTENT);}
        if(!userRole.equals(UserRole.ADMIN) && minutesSinceCreation > 5){throw new ResponseStatusException(HttpStatus.FORBIDDEN);}
        userGarden.getFlowers().remove(flower);
        flowerRepository.delete(flower);
    }

    public Flower getFlowerContent(long flowerId){
        return flowerRepository.findFlowerById(flowerId);}



    @Transactional(readOnly = true)
    public List<Preset> getFlowerPreset() {
        return presetRepository.findAllByContentType(ContentType.FLOWER);
    }


}
