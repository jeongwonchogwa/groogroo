package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.fruit.ResponseFruitDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreeDto;
import com.jwcg.groogroo.model.entity.Fruit;
import com.jwcg.groogroo.model.entity.Tree;
import com.jwcg.groogroo.model.entity.User;
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
        user.setTree(tree);

        userRepository.save(user);
        treeRepository.save(tree);
    }

    public void modifyMainTreeImage(long userId, String imageUrl) {
        Tree tree = treeRepository.findTreeByUserId(userId);
        tree.setImageUrl(imageUrl);

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
                    .type(fruit.getType())
                    .build();

            LocalDateTime cur = LocalDateTime.now();
            LocalDateTime target = fruit.getCreateTime();
            if (cur.isEqual(target)) {
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

        List<Tree> trees = treeRepository.findByNameLike(name);
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
                            .type(fruit.getType())
                            .build();

                    LocalDateTime cur = LocalDateTime.now();
                    LocalDateTime target = fruit.getCreateTime();
                    if (cur.isEqual(target)) {
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
}
