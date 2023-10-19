package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.fruit.ResponseFruitDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreeDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.PresetRepository;
import com.jwcg.groogroo.repository.TreeRepository;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class TreeService {

    private final UserRepository userRepository;
    private final TreeRepository treeRepository;
    private final PresetRepository presetRepository;

    public boolean checkNameDuplicate(String name) {
        return treeRepository.existsByName(name);
    }

    public void makeMainTree(long userId, String imageUrl, String name) {
        User user = userRepository.findUserById(userId);
        Tree tree = Tree.builder()
                .user(user)
                .imageUrl(imageUrl)
                .name(name)
                .build();
//        user.setTree(tree);

//        userRepository.save(user);
        log.info("=========== 저장 전 ===========");
        treeRepository.save(tree);
        log.info("=========== 저장 성공 ===========");
    }

    public void modifyMainTree(long userId, String imageUrl, String name) {
        Tree tree = treeRepository.findTreeByUserId(userId);
        tree.setImageUrl(imageUrl);
        tree.setName(name);

        treeRepository.save(tree);
    }

    @Transactional(readOnly = true)
    public ResponseTreeDto getMainTreeContents(long userId) {

        Tree tree = treeRepository.findTreeByUserId(userId);
        ResponseTreeDto responseTreeDto = ResponseTreeDto.builder()
                .id(tree.getId())
                .imageUrl(tree.getImageUrl())
                .name(tree.getName())
                .fruitsCount(tree.getFruits().size())
                .build();

        List<ResponseFruitDto> fruits = new ArrayList<>();

        for (Fruit fruit : tree.getFruits()) {
            ResponseFruitDto now = ResponseFruitDto.builder()
                    .id(fruit.getId())
                    .writerId(fruit.getWriterId())
                    .content(fruit.getContent())
                    .imageUrl(fruit.getImageUrl())
                    .writerNickname(fruit.getWriterNickname())
                    .build();

            LocalDateTime cur = LocalDateTime.now();
            LocalDateTime target = fruit.getCreateTime();
            if (cur.toLocalDate().isEqual(target.toLocalDate())) {
                now.setCreateTime(target.format(DateTimeFormatter.ofPattern("HH:MM")));
            }else {
                now.setCreateTime(target.format(DateTimeFormatter.ofPattern("YY.MM.dd")));
            }

            fruits.add(now);
        }

        responseTreeDto.setFruits(fruits);

        return responseTreeDto;
    }

    @Transactional(readOnly = true)
    public List<ResponseTreeDto> searchTree(long userId, String name) {

        log.info("========검색어: " + name + "==========");
        List<Tree> trees = treeRepository.findByNameContains(name);
        List<ResponseTreeDto> returnData = new ArrayList<>();

        for (Tree tree : trees) {
            ResponseTreeDto responseTreeDto = ResponseTreeDto.builder()
                    .id(tree.getId())
                    .imageUrl(tree.getImageUrl())
                    .name(tree.getName())
                    .fruitsCount(tree.getFruits().size())
                    .build();
            List<ResponseFruitDto> fruits = new ArrayList<>();

            for (Fruit fruit : tree.getFruits()) {
                if (fruit.getWriterId() == userId){
                    ResponseFruitDto now = ResponseFruitDto.builder()
                            .id(fruit.getId())
                            .writerId(fruit.getWriterId())
                            .content(fruit.getContent())
                            .imageUrl(fruit.getImageUrl())
                            .writerNickname(fruit.getWriterNickname())
                            .build();

                    LocalDateTime cur = LocalDateTime.now();
                    LocalDateTime target = fruit.getCreateTime();
                    if (cur.toLocalDate().isEqual(target.toLocalDate())) {
                        now.setCreateTime(target.format(DateTimeFormatter.ofPattern("HH:MM")));
                    }else {
                        now.setCreateTime(target.format(DateTimeFormatter.ofPattern("YY.MM.dd")));
                    }

                    fruits.add(now);
                }

                responseTreeDto.setFruits(fruits);
            }

            returnData.add(responseTreeDto);
        }

        return returnData;
    }

    @Transactional(readOnly = true)
    public List<Preset> getTreePreset() {
        return presetRepository.findAllByContentType(ContentType.TREE);
    }
}
