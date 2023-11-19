package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.exception.CustomException;
import com.jwcg.groogroo.model.dto.garden.*;
import com.jwcg.groogroo.model.dto.flower.ResponseFlowerPosDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreePosDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import com.jwcg.groogroo.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
@AllArgsConstructor
public class GardenService {

    private final int PAGESIZE = 10;

    private final NotificationService notificationService;
    private final GardenLikeService gardenLikeService;

    private final GardenRepository gardenRepository;
    private final UserRepository userRepository;
    private final UserGardenRepository userGardenRepository;
    private final TreeGardenRepository treeGardenRepository;
    private final GardenLikeRepository gardenLikeRepository;
    private final JwtUtil jwtUtil;
    private final FlowerRepository flowerRepository;

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

        if (!gardenRepository.existsByUrl(URL.toString())) return URL.toString();
        else return makeURL();
    }

    public ResponseGardenGenerationDto makeGarden(long userId, String name, String description, int capacity, int mapType){

        // url 생성
        String url = makeURL();
        User user = userRepository.findUserById(userId);

        Garden garden = Garden.builder()
                .name(name)
                .description(description)
                .url(url)
                .capacity(capacity)
                .memberCnt(1)
                .mapType(mapType)
                .build();
        log.info("garden 저장 성공");
        gardenRepository.save(garden);

        // 생성한 사람과 그 나무를 해당 정원에 등록(관리자)
        UserGarden userGarden = UserGarden.builder()
                .gardenRole(GardenRole.MASTER)
                .joinState(JoinState.ACCEPT)
                .build();
        log.info("userGarden 생성 성공");

        userGarden.setUser(user);
        log.info("setUser 성공");

        try{
            userGarden.setGarden(garden);
            log.info("setGarden 생성 성공");

        } catch (Exception e) {
            log.error(e.getMessage());
            log.error(Arrays.toString(e.getStackTrace()));
        }

        userGardenRepository.save(userGarden);

        ResponseGardenGenerationDto response = ResponseGardenGenerationDto.builder()
                .gardenId(garden.getId())
                .url(url)
                .build();

        return response;
    }

    @Transactional(readOnly = true)
    public ResponseGardenInfoDto getGardenInfo(long userId, long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);
        List<TreeGarden> treeInfo = garden.getTreeGardens();
        List<UserGarden> flowerInfo = garden.getUserGardens();

        UserGarden ug = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        ResponseGardenInfoDto responseGardenInfoDto = ResponseGardenInfoDto.builder()
                .gardenId(gardenId)
                .name(garden.getName())
                .description(garden.getDescription())
                .likes(gardenLikeService.getGardenLikes(gardenId))
                .capacity(garden.getCapacity())
                .memberCnt(garden.getMemberCnt())
                .mapType(garden.getMapType())
                .state(ug==null? null : ug.getJoinState().toString())
                .gardenRole(ug==null? null:ug.getGardenRole().toString())
                .build();
        log.info("좋아요 개수: " + responseGardenInfoDto.getLikes());
        responseGardenInfoDto.setTreePos(new ArrayList<>());
        responseGardenInfoDto.setFlowerPos(new ArrayList<>());

        log.info("나무, 꽃 정보 확인 + 정원 dto 생성");
        // 나무 위치 정보 삽입
        for (TreeGarden treeGarden : treeInfo) {
            // 삭제된 나무면 건너 뛰기
            if(treeGarden.getTree().getDeleteDate() != null) continue;

            Tree tree = treeGarden.getTree();

            ResponseTreePosDto responseTreePosDto = ResponseTreePosDto.builder()
                    .id(treeGarden.getId())
                    .treeId(treeGarden.getTree().getId())
                    .x(treeGarden.getX())
                    .y(treeGarden.getY())
                    .imageUrl(treeGarden.getImageUrl())
                    .name(tree.getName())
                    .fruitCnt(tree.getFruits().size())
                    .build();

            log.info("나무 위치 정보: " + responseTreePosDto.toString());

            responseGardenInfoDto.getTreePos().add(responseTreePosDto);
        }

        // 꽃 위치 정보 삽입
        for (UserGarden userGarden : flowerInfo) {
            // 삭제된 userGarden에 대해 건너 뛰기
            if(userGarden.getDeleteDate() != null) continue;
            for (Flower flower : userGarden.getFlowers()) {
                ResponseFlowerPosDto responseFlowerPosDto = ResponseFlowerPosDto.builder()
                        .id(flower.getId())
                        .x(flower.getX())
                        .y(flower.getY())
                        .imageUrl(flower.getImageUrl())
                        .build();

                responseGardenInfoDto.getFlowerPos().add(responseFlowerPosDto);
                log.info("꽃 위치 정보: " + responseFlowerPosDto.toString());

            }
        }

        return responseGardenInfoDto;
    }

    /*
    사용자의 정원 목록 조회 (페이징)
    페이지 번호와 페이지 크기를 받아 10개씩 사용자의 정원 목록을 반환
    */
    @Transactional(readOnly = true)
    public Page<ResponseUserGardenDto> getUserGardenByPagination(long userId, int page) {
        Pageable pageable = PageRequest.of(page, PAGESIZE, Sort.by(Sort.Order.asc("state")));

        List<UserGarden> userGardens = userGardenRepository.findAllByUserIdAndDeleteDateIsNull(userId);
        List<ResponseUserGardenDto> returnData = new ArrayList<>();
        for (UserGarden userGarden : userGardens) {
            JoinState joinState = userGarden.getJoinState();
            log.info(joinState.toString());

            if (joinState.equals(JoinState.WAIT) || joinState.equals(JoinState.ACCEPT)) {
                Garden garden = userGarden.getGarden();
                UserGarden masterGarden = userGardenRepository.findUserGardenByGardenIdAndGardenRole(garden.getId(), GardenRole.MASTER);

                log.info(garden.toString());
//                long likes = gardenLikeRepository.countByGardenId(garden.getId());
//                long likes = gardenLikeRepository.findAllByGardenId(garden.getId()).size();
                long likes = gardenLikeService.getGardenLikes(garden.getId());
                ResponseUserGardenDto responseUserGardenDto = ResponseUserGardenDto.builder()
                        .gardenId(garden.getId())
                        .name(garden.getName())
                        .description(garden.getDescription())
                        .state(joinState.toString())
                        .capacity(garden.getCapacity())
                        .memberCnt(garden.getMemberCnt())
                        .likes(likes)
                        .url(garden.getUrl())
                        .mapType(garden.getMapType())
                        .master(masterGarden.getUser().getTree().getName())
                        .build();
                log.info(responseUserGardenDto.toString());
                returnData.add(responseUserGardenDto);
            }
        }

        // 페이지네이션 적용
        int start = (int) pageable.getOffset();

        // 데이터 없는 페이지 조회 시 빈 리스트 반환
        if (start >= returnData.size()) {
            return Page.empty(pageable);
        }

        int end = Math.min((start + pageable.getPageSize()), returnData.size());

        log.info(Integer.toString(start));
        log.info(Integer.toString(end));

        List<ResponseUserGardenDto> userGardensOnPage = returnData.subList(start, end);

        return new PageImpl<>(userGardensOnPage, pageable, returnData.size());
    }

    public void changeRoleFromMaster(long userId, String role, long gardenId, long targetId) {

        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        UserGarden targetUserGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(targetId, gardenId);

        log.info("Garden Service - 직책 변경 " + gardenId + " -> " + role);
        if (role.equals("MASTER")) {
            userGarden.setGardenRole(GardenRole.MEMBER);
            targetUserGarden.setGardenRole(GardenRole.MASTER);
        } else if (role.equals("ADMIN")) {
            targetUserGarden.setGardenRole(GardenRole.ADMIN);
        } else {
            targetUserGarden.setGardenRole(GardenRole.MEMBER);
        }

        log.info(userGarden.getGardenRole().toString());
        log.info(targetUserGarden.getGardenRole().toString());

        userGardenRepository.save(userGarden);
        userGardenRepository.save(targetUserGarden);
    }

    @Transactional(readOnly = true)
    public String getGardenLink(long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);

        return garden.getUrl();
    }

    public void deleteGarden(Long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);
        List<UserGarden> userGardens = garden.getUserGardens();
        List<TreeGarden> treeGardens = garden.getTreeGardens();

        LocalDate now = LocalDate.now();

        for (UserGarden userGarden : userGardens) {
            userGarden.setDeleteDate(now);
        }

        for (TreeGarden treeGarden : treeGardens) {
            treeGarden.setDeleteDate(now);
        }

        Garden deletedGarden = Garden.builder()
                .id(garden.getId())
                .name(garden.getName())
                .description(garden.getDescription())
                .url(garden.getUrl())
                .deleteDate(now)
                .userGardens(userGardens)
                .treeGardens(treeGardens)
                .build();

        gardenRepository.save(deletedGarden);
    }

    public void updateOthersJoinState(String token, Long userId, Long gardenId, String joinState) {
        token = token.split(" ")[1];
        Long id = jwtUtil.getId(token);
        String userRole = jwtUtil.getRole(token);

        // ADMIN계정이 아닌 일반 USER 계정인 경우 gardenRole 확인하기
        if(userRole.equals("USER")){
            log.info("권한 확인");
            GardenRole gardenRole = userGardenRepository.findUserGardenByUserIdAndGardenId(id, gardenId).getGardenRole();

            // MEMBER가 다른 사람의 state 변경하는 경우 예외 처리
            if(gardenRole == GardenRole.MEMBER){
                throw new CustomException(HttpStatus.FORBIDDEN, "JoinState 변경 실패 - 권한 없음");
            }

            // 정원 추방은 MASTER만 가능! ADMIN이 추방하는 경우 예외 처리
            if(gardenRole == GardenRole.ADMIN && joinState.equals("KICK")){
                throw new CustomException(HttpStatus.FORBIDDEN, "JoinState 변경 실패 - 권한 없음");
            }
            log.info("멤버 상태 변경 권한 있음");
        }

        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        JoinState state = JoinState.WAIT;
        String content = "";
        switch (joinState) {
            case "ACCEPT":
                state = JoinState.ACCEPT;
                content = "정원에 가입 신청이 승인되었습니다. 지금 방문 해보세요.";
                break;
            case "REFUSE":
                state = JoinState.REFUSE;
                content = "정원에 가입 신청이 거절되었습니다.";
                break;
            case "KICK":
                state = JoinState.KICK;
                content = "정원에서 추방되었습니다.";
                break;
            default:
                throw new CustomException(HttpStatus.BAD_REQUEST, "잘못된 가입 처리 요청입니다.");
        }
        // 알림 발송
        Garden garden = gardenRepository.findGardenById(gardenId);

        Notification notification = notificationService.makeNotification(userId, gardenId, gardenId, content, NotificationType.GARDEN_RESPONSE, garden.getName());
        notificationService.send(userId, notification);

        updateJoinState(userGarden, state);
        log.info("정원 멤버 상태 {}(으)로 변경 완료", joinState);
    }

    public void joinGarden(Long userId, long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);
        User user = userRepository.findUserById(userId);
        // 인원 수 확인해서 정원 초과면 예외 발생
        if(garden.getCapacity()<=garden.getMemberCnt()){
            throw new CustomException(HttpStatus.FORBIDDEN, "정원 가입 실패 - 정원 초과");
        }
        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);

        UserGarden updatedUserGarden = UserGarden.builder()
                .id(userGarden==null? null:userGarden.getId())
                .gardenRole(GardenRole.MEMBER)
                .joinState(JoinState.WAIT)
                .build();

        updatedUserGarden.setGarden(garden);
        updatedUserGarden.setUser(user);

        userGardenRepository.save(updatedUserGarden);

        // 알림 보내기
        // 정원의 관리자이상 권한 찾기
        List<UserGarden> admins = userGardenRepository.findAllByGardenIdAndGardenRoleIn(gardenId, Arrays.asList(GardenRole.MASTER, GardenRole.ADMIN));

        // 모든 관리자에게 알림 발송
        for (UserGarden admin : admins) {
            long receiverId = admin.getUser().getId();
            String content = "정원에 가입 신청이 왔어요. 확인 해주세요.";
            Notification joinNotification = notificationService.makeNotification(receiverId, gardenId, gardenId, content, NotificationType.GARDEN_REQUEST, garden.getName());
            notificationService.send(receiverId, joinNotification);
        }
    }

    // 정원 가입 결과 조회 - WAIT, ACCEPT, REFUSE 인 정원 목록 반환
    @Transactional(readOnly = true)
    public List<ResponseUserGardenDto> getGardenJoinStateList(Long userId) {

        List<UserGarden> userGardens = userGardenRepository.findAllByUserIdAndDeleteDateIsNull(userId);
        List<ResponseUserGardenDto> list = new ArrayList<>();

        for (UserGarden userGarden : userGardens) {
            JoinState joinState = userGarden.getJoinState();
            if (joinState.equals(JoinState.WAIT) || joinState.equals(JoinState.ACCEPT) || joinState.equals(JoinState.REFUSE)) {
                ResponseUserGardenDto responseUserGardenDto = ResponseUserGardenDto.builder()
                        .gardenId(userGarden.getGarden().getId())
                        .name(userGarden.getGarden().getName())
                        .description(userGarden.getGarden().getDescription())
                        .state(joinState.toString())
                        .capacity(userGarden.getGarden().getCapacity())
                        .memberCnt(userGarden.getGarden().getMemberCnt())
                        //TODO: 좋아요 수 추가하기
//                        .likes()
                        .build();

                list.add(responseUserGardenDto);
            }
        }

        return list;
    }

    // 정원 탈퇴
    public void withdrawFromGarden(Long userId, Long gardenId) {
        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        GardenRole gardenRole = userGarden.getGardenRole();
        // MASTER면 탈퇴 불가 (다른 사람에게 위임해줘야함)
        if(gardenRole == GardenRole.MASTER) {
            throw new CustomException(HttpStatus.FORBIDDEN, "정원 탈퇴 실패 - MASTER 권한 위임 후 탈퇴 가능");
        }
        updateJoinState(userGarden, JoinState.WITHDRAWAL);
    }

    // joinState를 변환하는 메서드
    private void updateJoinState(UserGarden userGarden, JoinState joinState) {
        Garden garden = userGarden.getGarden();
        UserGarden updatedUserGarden = UserGarden.builder()
                .id(userGarden.getId())
                .gardenRole(userGarden.getGardenRole())
                .joinState(joinState)
                .deleteDate(null)
                .flowers(userGarden.getFlowers())
                .user(userGarden.getUser())
                .build();

        // 승인하면 인원 +1, 탈퇴/추방 하면 인원 -1
        int cnt = 0;
        switch (joinState){
            case ACCEPT :
                cnt = 1;
                break;
            case WITHDRAWAL: case KICK:
                cnt = -1;
                
        }

        Garden updatedGarden = Garden.builder()
                .id(garden.getId())
                .name(garden.getName())
                .description(garden.getDescription())
                .url(garden.getUrl())
                .capacity(garden.getCapacity())
                .memberCnt(garden.getMemberCnt()+cnt) // 인원수 변경
                .treeGardens(garden.getTreeGardens())
                .mapType(garden.getMapType())
                .build();

        updatedUserGarden.setGarden(updatedGarden);

        gardenRepository.save(updatedGarden);
        userGardenRepository.save(updatedUserGarden);
    }

    // treeGarden 생성
    public void createTreeGarden(Long userId, Long gardenId, String imageUrl, int x, int y) {
        Garden garden = gardenRepository.findGardenById(gardenId);
        User user = userRepository.findUserById(userId);

        TreeGarden treeGarden = TreeGarden.builder()
                .x(x)
                .y(y)
                .imageUrl(imageUrl)
                .build();

        treeGarden.setGarden(garden);
        treeGarden.setTree(user.getTree());
        log.info("treeGarden 생성 성공" + treeGarden.getGarden().toString());

        treeGardenRepository.save(treeGarden);
    }

    // 꽃 & 나무 위치 수정
    @Transactional
    public void updateFlowersAndTrees(RequestReplaceFlowersAndTreesDto request) {
        List<FlowerDto> flowers = request.getFlowers();
        List<TreeDto> trees = request.getTrees();

        for(FlowerDto flowerDto : flowers){
            Flower flower = flowerRepository.findFlowerById(flowerDto.getId());
            Flower updatedFlower = Flower.builder()
                    .id(flower.getId())
                    .content(flower.getContent())
                    .imageUrl(flower.getImageUrl())
                    .writerNickname(flower.getWriterNickname())
                    .x(flowerDto.getX())
                    .y(flowerDto.getY())
                    .createTime(flower.getCreateTime())
                    .build();
            updatedFlower.setUserGarden(flower.getUserGarden());
            flowerRepository.save(updatedFlower);
        }

        for(TreeDto treeDto : trees){
            TreeGarden treeGarden = treeGardenRepository.findTreeGardenById(treeDto.getId());
            TreeGarden updatedTreeGarden = TreeGarden.builder()
                    .id(treeGarden.getId())
                    .imageUrl(treeGarden.getImageUrl())
                    .x(treeDto.getX())
                    .y(treeDto.getY())
                    .build();
            updatedTreeGarden.setTree(treeGarden.getTree());
            updatedTreeGarden.setGarden(treeGarden.getGarden());
            treeGardenRepository.save(updatedTreeGarden);
        }
    }

    // 정원에 나무가 존재하는지 확인
    public Long checkTreeGarden(Long userId, Long gardenId) {
        Tree tree = userRepository.findUserById(userId).getTree();
        TreeGarden treeGarden = treeGardenRepository.findTreeGardenByTreeIdAndGardenId(tree.getId(), gardenId);
        if(treeGarden != null){
            return treeGarden.getId();
        } else {
            return null;
        }
    }

    // 가입 신청자 목록
    public List<ResponseGardenMemberInfoDto> getGardenWaitList(Long gardenId) {

        List<UserGarden> userGardens = userGardenRepository.findAllByGardenIdAndJoinStateAndDeleteDateIsNull(gardenId, JoinState.WAIT);

        List<ResponseGardenMemberInfoDto> waits = new ArrayList<>();

        for(UserGarden userGarden : userGardens){
            Tree tree = userGarden.getUser().getTree();
            ResponseGardenMemberInfoDto responseGardenMemberInfoDto = ResponseGardenMemberInfoDto.builder()
                    .userId(userGarden.getUser().getId())
                    .treeName(tree==null ? null : tree.getName())
                    .gardenRole("MEMBER")
                    .build();

            waits.add(responseGardenMemberInfoDto);
        }

        return waits;
    }

    // 소속 멤버 목록
    public List<ResponseGardenMemberInfoDto> getGardenMemberList(Long gardenId) {

        List<UserGarden> userGardens = userGardenRepository.findAllByGardenIdAndJoinStateAndDeleteDateIsNull(gardenId, JoinState.ACCEPT);

        List<ResponseGardenMemberInfoDto> members = new ArrayList<>();

        for(UserGarden userGarden : userGardens){
            Tree tree = userGarden.getUser().getTree();
            ResponseGardenMemberInfoDto responseGardenMemberInfoDto = ResponseGardenMemberInfoDto.builder()
                    .userId(userGarden.getUser().getId())
                    .treeName(tree==null ? null : tree.getName())
                    .gardenRole(userGarden.getGardenRole().toString())
                    .build();

            members.add(responseGardenMemberInfoDto);
        }

        return members;
    }
}
