package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.fruit.ResponseFruitDto;
import com.jwcg.groogroo.model.dto.fruit.ResponseFruitPresetDto;
import com.jwcg.groogroo.model.dto.fruit.ResponseSimpleFruitDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.FruitRepository;
import com.jwcg.groogroo.repository.PresetRepository;
import com.jwcg.groogroo.repository.TreeRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class FruitService {

    private final NotificationService notificationService;

    private final FruitRepository fruitRepository;
    private final TreeRepository treeRepository;
    private final PresetRepository presetRepository;

    // 기본적으로 나무 조회 시 조건에 맞는 열매 데이터까지 조회하게 만들어서 필요하진 않으나 나중에 사용할 수도 있어서 일단 만들어둠.
    @Transactional(readOnly = true)
    public List<Fruit> getAllFruitsByTreeId(long treeId){
        return fruitRepository.findAllByTreeIdAndDeleteDateIsNull(treeId);
    }

    public void makeFruit(long userId, long treeId, String writerNickname, String imageUrl, String content){
        Tree tree = treeRepository.findTreeById(treeId);

        Fruit fruit = Fruit.builder()
                .content(content)
                .createTime(LocalDateTime.now())
                .writerId(userId)
                .writerNickname(writerNickname)
                .imageUrl(imageUrl)
                .build();
        fruit.setTree(tree);

        fruitRepository.save(fruit);

        String msg = "나의 나무에 열매가 달렸어요. 확인 해보세요.";
        long receiverId = tree.getUser().getId();
        Notification notification = notificationService.makeNotification(receiverId, null, treeId, msg, NotificationType.FRUIT, tree.getName());
        notificationService.send(receiverId, notification);

    }

    public void deleteFruit(long fruitId){

        Fruit fruit = fruitRepository.findFruitById(fruitId);

        if (fruit != null){
            fruit.getTree().getFruits().remove(fruit);
            fruitRepository.delete(fruit);
        }
    }

    // 마찬가지로 열매 상세조회 로직, 나무에서 조회를 하기 때문에 나중에 사용처가 생길 수도 있어서 만들어둠
    @Transactional(readOnly = true)
    public Fruit getFruitContent(long fruitId) {
        return fruitRepository.findFruitById(fruitId);
    }


    @Transactional(readOnly = true)
    public ResponseSimpleFruitDto getSimpleFruitContent(long fruitId) {
        Fruit fruit = fruitRepository.findFruitById(fruitId);
        ResponseSimpleFruitDto responseFruitDto = ResponseSimpleFruitDto.builder()
                .id(fruit.getId())
                .writerNickname(fruit.getWriterNickname())
                .content(fruit.getContent())
                .build();
        return responseFruitDto;
    }

    @Transactional(readOnly = true)
    public List<Preset> getFruitPreset(){
        return presetRepository.findAllByContentType(ContentType.FRUIT);
    }



}
