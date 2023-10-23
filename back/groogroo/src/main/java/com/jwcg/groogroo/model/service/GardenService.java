package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.Garden.ResponseGardenInfoDto;
import com.jwcg.groogroo.model.dto.flower.ResponseFlowerPosDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreePosDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.GardenRepository;
import com.jwcg.groogroo.repository.TreeGardenRepository;
import com.jwcg.groogroo.repository.UserGardenRepository;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
@AllArgsConstructor
public class GardenService {

    private final GardenRepository gardenRepository;
    private final UserRepository userRepository;
    private final UserGardenRepository userGardenRepository;
    private final TreeGardenRepository treeGardenRepository;

    public String makeURL() {
        StringBuffer URL = new StringBuffer();
        Random random = new Random();
        for (int i = 0; i < 10; i++) {
            int index = random.nextInt(3);

            switch (index) {
                case 0:
                    // a ~ z
                    URL.append((char) ((int) (random.nextInt(26)) + 97));
                    break;
                case 1:
                    // A ~ Z
                    URL.append((char) ((int) (random.nextInt(26) + 65)));
                    break;
                case 2:
                    // 0 ~ 9
                    URL.append((random.nextInt(10)));
                    break;
            }
        }

        if(!gardenRepository.existsByUrl(URL.toString())) return URL.toString();
        else return makeURL();
    }

    public void makeGarden(long userId, String name, String description, int x, int y, String imageUrl){

        // url 생성
        String url = makeURL();
        User user = userRepository.findUserById(userId);

        Garden garden = Garden.builder()
                .name(name)
                .description(description)
                .url(url)
                .build();
        log.info("garden 저장 성공");
        gardenRepository.save(garden);

        // 생성한 사람과 그 나무를 해당 정원에 등록(관리자)
        UserGarden userGarden = UserGarden.builder()
                .gardenRole(GardenRole.ADMIN)
                .joinState(JoinState.ACCEPT)
                .build();

        userGarden.setUser(user);
        userGarden.setGarden(garden);

        log.info("userGarden 생성 성공");
        log.info(userGarden.getUser().toString());
        log.info(userGarden.getGarden().toString());
        try {
            userGardenRepository.save(userGarden);
            log.info("userGarden 저장 성공");
        } catch (Exception e) {
            log.info(e.getMessage());
        }


        TreeGarden treeGarden = TreeGarden.builder()
                .x(x)
                .y(y)
                .imageUrl(imageUrl)
                .build();

        log.info("treeGarden setGarden");
        treeGarden.setGarden(garden);
        log.info("treeGarden setTree");
        treeGarden.setTree(user.getTree());

        log.info("treeGarden 생성 성공" + treeGarden.getGarden().toString());
        log.info(treeGarden.getTree().toString());

        try {
            treeGardenRepository.save(treeGarden);
            log.info("treeGarden 저장 성공");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public ResponseGardenInfoDto getGardenInfo(long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);
        List<TreeGarden> treeInfo = garden.getTreeGardens();
        List<UserGarden> flowerInfo = garden.getUserGardens();

        ResponseGardenInfoDto responseGardenInfoDto = ResponseGardenInfoDto.builder()
                .name(garden.getName())
                .description(garden.getDescription())
                .build();

        // 나무 위치 정보 삽입
        for (TreeGarden treeGarden : treeInfo) {
            ResponseTreePosDto responseTreePosDto = ResponseTreePosDto.builder()
                    .x(treeGarden.getX())
                    .y(treeGarden.getY())
                    .build();
            responseGardenInfoDto.getTreePos().add(responseTreePosDto);
        }

        // 꽃 위치 정보 삽입
        for (UserGarden userGarden : flowerInfo) {
            for (Flower flower : userGarden.getFlowers()){
                ResponseFlowerPosDto responseFlowerPosDto = ResponseFlowerPosDto.builder()
                        .x(flower.getX())
                        .y(flower.getY())
                        .build();
                responseGardenInfoDto.getFlowerPos().add(responseFlowerPosDto);
            }
        }

        return responseGardenInfoDto;
    }

}
