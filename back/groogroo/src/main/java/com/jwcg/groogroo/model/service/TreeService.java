package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.fruit.ResponseFruitDto;
import com.jwcg.groogroo.model.dto.tree.ResponseSimpleTreeDto;
import com.jwcg.groogroo.model.dto.tree.ResponseSimpleTreeGardenDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreeDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final TreeUserPresetRepository treeUserPresetRepository;
    private final TreeGardenRepository treeGardenRepository;

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

        // 유저 프리셋에 해당 이미지 추가
        TreeUserPreset treeUserPreset = TreeUserPreset.builder()
                .imageUrl(imageUrl)
                .build();
        treeUserPreset.setUser(user);

        treeUserPresetRepository.save(treeUserPreset);

        treeRepository.save(tree);
        log.info("=========== 저장 성공 ===========");
        user.setTree(tree);

        userRepository.save(user);
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
            // 삭제된 꽃이면 건너 뛰기
            if(fruit.getDeleteDate() != null) continue;

            ResponseFruitDto now = ResponseFruitDto.builder()
                    .id(fruit.getId())
                    .writerId(fruit.getWriterId())
                    .content(fruit.getContent())
                    .imageUrl(fruit.getImageUrl())
                    .writerNickname(fruit.getWriterNickname())
                    .build();

            log.info(now.toString());
            LocalDateTime cur = LocalDateTime.now();
            LocalDateTime target = fruit.getCreateTime();
            if (cur.toLocalDate().isEqual(target.toLocalDate())) {
                now.setCreateTime(target.format(DateTimeFormatter.ofPattern("HH:mm")));
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
        String word = "%" + name + "%";
        log.info(word);
        List<Tree> trees = treeRepository.findByNameLikeAndDeleteDateIsNull(word);
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

                // 삭제된 꽃이면 건너 뛰기
                if(fruit.getDeleteDate() != null) continue;

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
                        now.setCreateTime(target.format(DateTimeFormatter.ofPattern("HH:mm")));
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

    public void addTreePreset(long userId, String imageUrl) {
        User user = userRepository.findUserById(userId);
        TreeUserPreset treeUserPreset = TreeUserPreset.builder()
                .imageUrl(imageUrl)
                .build();

        treeUserPreset.setUser(user);

        treeUserPresetRepository.save(treeUserPreset);
        userRepository.save(user);
    }


    @Transactional(readOnly = true)
    public List<Preset> getTreePreset(long userId) {

        List<Preset> presets = presetRepository.findAllByContentType(ContentType.TREE);
        List<TreeUserPreset> treeUserPresets = treeUserPresetRepository.findAllByUserId(userId);

        for (TreeUserPreset treeUserPreset : treeUserPresets) {
            Preset preset = Preset.builder()
                    .contentType(ContentType.TREE)
                    .imageUrl(treeUserPreset.getImageUrl())
                    .build();

            presets.add(preset);
        }

        return presets;
    }

    public void deleteTreePreset(long treeuserPresetId){
        treeUserPresetRepository.deleteById(treeuserPresetId);
    }

    public void deleteTree(Long treeId) {
        Tree tree = treeRepository.findTreeById(treeId);
        log.info("나무: {}", tree);
        if (tree != null){
            Tree deletedTree = Tree.builder()
                    .id(tree.getId())
                    .imageUrl(tree.getImageUrl())
                    .name(tree.getName())
                    .deleteDate(LocalDate.now())
                    .user(tree.getUser())
                    .fruits(tree.getFruits())
                    .treeGardens(tree.getTreeGardens())
                    .build();
            treeRepository.save(deletedTree);
        }
    }

    @Transactional(readOnly = true)
    public ResponseSimpleTreeDto getSimpleTreeContent(long treeId) {
        Tree tree = treeRepository.findTreeById(treeId);
        ResponseSimpleTreeDto simpleTreeDto = ResponseSimpleTreeDto.builder()
                .id(tree.getId())
                .imageUrl(tree.getImageUrl())
                .name(tree.getName())
                .build();
        return simpleTreeDto;
    }

    public void deleteTreeGarden(Long treeGardenId) {
        TreeGarden treeGarden = treeGardenRepository.findTreeGardenById(treeGardenId);
        if (treeGarden != null){
            TreeGarden deletedTreeGarden = TreeGarden.builder()
                    .id(treeGarden.getId())
                    .imageUrl(treeGarden.getImageUrl())
                    .x(treeGarden.getX())
                    .y(treeGarden.getY())
                    .deleteDate(LocalDate.now())
                    .tree(treeGarden.getTree())
                    .garden(treeGarden.getGarden())
                    .build();

            treeGardenRepository.save(deletedTreeGarden);
        }
    }

    @Transactional(readOnly = true)
    public ResponseSimpleTreeGardenDto getSimpleTreeGardenContent(long treeGardenId) {
        TreeGarden treeGarden = treeGardenRepository.findTreeGardenById(treeGardenId);
        ResponseSimpleTreeGardenDto simpleTreeGardenDto = ResponseSimpleTreeGardenDto.builder()
                .id(treeGarden.getId())
                .imageUrl(treeGarden.getImageUrl())
                .build();
        return simpleTreeGardenDto;
    }
}
