package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.fruit.ResponseFruitPresetDto;
import com.jwcg.groogroo.model.entity.ContentType;
import com.jwcg.groogroo.model.entity.Fruit;
import com.jwcg.groogroo.model.entity.Preset;
import com.jwcg.groogroo.model.entity.Tree;
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

    private final FruitRepository fruitRepository;
    private final TreeRepository treeRepository;
    private final PresetRepository presetRepository;

    // 기본적으로 나무 조회 시 조건에 맞는 열매 데이터까지 조회하게 만들어서 필요하진 않으나 나중에 사용할 수도 있어서 일단 만들어둠.
    @Transactional(readOnly = true)
    public List<Fruit> getAllFruitsByTreeId(long treeId){
        return fruitRepository.findAllByTreeId(treeId);
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
    }

    public void deleteFruit(long treeId, long fruitId){
        Tree tree = treeRepository.findTreeById(treeId);

        Fruit fruit = fruitRepository.findFruitById(fruitId);

        if (fruit != null){
            tree.getFruits().remove(fruit);
            fruitRepository.delete(fruit);
        }
    }

    // 마찬가지로 열매 상세조회 로직, 나무에서 조회를 하기 때문에 나중에 사용처가 생길 수도 있어서 만들어둠
    @Transactional(readOnly = true)
    public Fruit getFruitContent(long fruitId) {
        return fruitRepository.findFruitById(fruitId);
    }

    @Transactional(readOnly = true)
    public List<Preset> getFruitPreset(){
        return presetRepository.findAllByContentType(ContentType.FRUIT);
    }



}
