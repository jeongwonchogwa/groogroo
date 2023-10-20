package com.jwcg.groogroo.model.service;


import com.jwcg.groogroo.model.entity.ContentType;
import com.jwcg.groogroo.model.entity.Flower;
import com.jwcg.groogroo.model.entity.Preset;
import com.jwcg.groogroo.model.entity.UserGarden;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class FlowerService {

    private final UserGardenRepository userGardenRepository;
    private final FlowerRepository flowerRepository;
    private final PresetRepository presetRepository;


    public void makeFlower(long gardenId, String writerNickname, String imageUrl, String content ){
        UserGarden userGarden = userGardenRepository.findUserGardenByGardenId(gardenId);
        Flower flower = Flower.builder()
                .content(content)
                .createTime(LocalDateTime.now())
                .writerNickname(writerNickname)
                .imageUrl(imageUrl)
                .build();

        flower.setUserGarden(userGarden);
    }

    public void deleteFlower(long flowerId){
        Flower flower = flowerRepository.findFlowerById(flowerId);
        UserGarden userGarden = userGardenRepository.findUserGardenByGardenId(flower.getUserGarden().getGarden().getId());
        if (flower != null){
            userGarden.getFlowers().remove(flower);
            flowerRepository.delete(flower);
        }
    }

    public Flower getFlowerContent(long flowerId){
        return flowerRepository.findFlowerById(flowerId);}

    @Transactional(readOnly = true)
    public List<Preset> getFlowerPreset() {
        return presetRepository.findAllByContentType(ContentType.FLOWER);
    }


}
