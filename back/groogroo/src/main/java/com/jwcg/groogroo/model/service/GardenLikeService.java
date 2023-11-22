package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.exception.CustomException;
import com.jwcg.groogroo.model.dto.garden.ResponseGardenRankingDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.GardenLikeRepository;
import com.jwcg.groogroo.repository.GardenRepository;
import com.jwcg.groogroo.repository.MySQLGardenLikeRepository;
import com.jwcg.groogroo.repository.UserGardenRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class GardenLikeService {

    private final int PAGESIZE = 10;

    private final GardenRepository gardenRepository;
    private final GardenLikeRepository gardenLikeRepository;
    private final UserGardenRepository userGardenRepository;
    private final MySQLGardenLikeRepository mySQLGardenLikeRepository;

    /*
    하나의 데이터가 redis에 데이터가 존재하지 않고 MySQL에만 존재할 때 redis에 업데이트 해주는 메서드
     */
    public void updateOneToRedis(long userId, long gardenId) {
        MySQLGardenLike mySQLGardenLike = mySQLGardenLikeRepository.findByUserIdAndGardenId(userId, gardenId);
        log.info("유저 아이디" + mySQLGardenLike.getUserId());
        log.info("정원 아이디" + mySQLGardenLike.getGardenId());
        GardenLike gardenLike = GardenLike.builder()
                .id(mySQLGardenLike.getUserId() + "/" + mySQLGardenLike.getGardenId())
                .userId(mySQLGardenLike.getUserId())
                .gardenId(mySQLGardenLike.getGardenId())
                .build();

        log.info("다음 객체를 Redis에 업데이트: " + gardenLike.toString());

        gardenLikeRepository.save(gardenLike);
    }

    /*
    userId나 gardenId에 해당하는 데이터가 redis에 존재하지 않을 때 모두 업데이트
     */
    public void updateAllToRedisByParam(long id, int mode) {
        List<MySQLGardenLike> mySQLGardenLikes;
        // userId
        if (mode == 0) mySQLGardenLikes = mySQLGardenLikeRepository.findAllByUserId(id);
        // gardenId
        else mySQLGardenLikes = mySQLGardenLikeRepository.findAllByGardenId(id);

        List<GardenLike> gardenLikes = new ArrayList<>();

        for (MySQLGardenLike now : mySQLGardenLikes) {
            GardenLike gardenLike = GardenLike.builder()
                    .id(now.getUserId() + "/" + now.getGardenId())
                    .userId(now.getUserId())
                    .gardenId(now.getGardenId())
                    .build();

            gardenLikes.add(gardenLike);
        }

        gardenLikeRepository.saveAll(gardenLikes);
    }

    /*
    MySQL의 정보 전체를 Redis로 업데이트
     */
    public void updateAllToRedis() {
        List<MySQLGardenLike> mySQLGardenLikes = mySQLGardenLikeRepository.findAll();
        List<GardenLike> gardenLikes = new ArrayList<>();

        for (MySQLGardenLike now : mySQLGardenLikes) {
            GardenLike gardenLike = GardenLike.builder()
                    .id(now.getUserId() + "/" + now.getGardenId())
                    .userId(now.getUserId())
                    .gardenId(now.getGardenId())
                    .build();

            gardenLikes.add(gardenLike);
        }

        gardenLikeRepository.saveAll(gardenLikes);
    }


    /*
    좋아요
    userId, gardenId 를 파라미터로 저장한다.
    TO DO: 데이터 정합성을 위해 Set 사용 : DONE
     */
    public void likeGarden(long userId, long gardenId) {
        GardenLike gardenLike = GardenLike.builder()
                .id(userId + "/" + gardenId)
                .userId(userId)
                .gardenId(gardenId)
                .build();

        gardenLikeRepository.save(gardenLike);
    }

    /*
    좋아요 취소
    좋아요가 된 상태에서 한 번 더 버튼을 누르면 좋아요가 취소된다
     */
    public void cancelLikeGarden(long userId, long gardenId) {
        GardenLike gardenLike = gardenLikeRepository.findByUserIdAndGardenId(userId, gardenId);

        if (gardenLike != null) {
            log.info("Redis의 {} garden like 삭제 시도", gardenLike.getId());
            gardenLikeRepository.deleteById(gardenLike.getId());
        }

        MySQLGardenLike mySQLGardenLike = mySQLGardenLikeRepository.findByUserIdAndGardenId(userId, gardenId);
        if (mySQLGardenLike != null) {
            log.info("MySQL의 {} garden like 삭제 시도", mySQLGardenLike.getId());
            mySQLGardenLikeRepository.deleteById(mySQLGardenLike.getId());
        }
    }

    /*
    좋아요 여부 조회
    프론트에서 이 결과로 좋아요가 눌려있어서 좋아요 취소 버튼을 넣거나
    안 눌려 있는 상태에선 좋아요 버튼을 넣어줄 수 있음
     */
    @Transactional(readOnly = true)
    public boolean isLikeGarden(long userId, long gardenId) {

        boolean existsOnRedis = gardenLikeRepository.existsByUserIdAndGardenId(userId, gardenId);

        log.info("레디스 정보 - 유저 {}은 {} 정원에 좋아요를 눌렀습니다: {}", userId, gardenId, Boolean.toString(existsOnRedis));
        if (existsOnRedis) return true;
        else {
            boolean existsOnMySQL = mySQLGardenLikeRepository.existsByUserIdAndGardenId(userId, gardenId);

            if (existsOnMySQL) {
                updateOneToRedis(userId, gardenId);
                return true;
            }else {
                return false;
            }
        }
    }

    /*
    좋아요 개수 조회
    특정 정원의 좋아요 개수를 리턴한다
     */
    @Transactional(readOnly = true)
    public long getGardenLikes(long gardenId) {
        updateAllToRedisByParam(gardenId, 1);

        List<GardenLike> gardenLikes = gardenLikeRepository.findAllByGardenId(gardenId);
        
        return gardenLikes.size();

    }

    /*
    좋아요한 정원 목록 조회
    현재는 사용하지 않지만 나중에 사용할 가능성 때문에 만듬
     */
    @Transactional(readOnly = true)
    public List<GardenLike> getLikedGarden(long userId) {
        boolean existsOnRedis = gardenLikeRepository.existsByUserId(userId);
        updateAllToRedisByParam(userId, 0);

        return gardenLikeRepository.findAllByUserId(userId);
    }

    /*
    좋아요 랭킹 목록 조회 (페이징)
    페이지 번호와 페이지 크기를 받아 10개씩 좋아요 랭킹을 반환
    */
    @Transactional(readOnly = true)
    public Page<ResponseGardenRankingDto> getGardenRankingByPagination(int page) {
//    public List<ResponseGardenRankingDto> getGardenRankingByPagination(int page) {

        Pageable pageable = PageRequest.of(page, PAGESIZE, Sort.by(Sort.Order.desc("likes")));

//        List<Garden> gardens = gardenRepository.findAll();
//        List<ResponseGardenRankingDto> returnData = new ArrayList<>();
        log.info("Garden Service - 리스트 조회 시도");

        try{
            Page<Object[]> result = gardenRepository.findAllOrderByLikes(pageable);

            log.info("==============리스트 생성 완료=============");

            List<ResponseGardenRankingDto> gardens = result.getContent().stream()
                    .map(obj -> {
                        ResponseGardenRankingDto gardenDto = ResponseGardenRankingDto.builder()
                                .gardenId((Long)obj[0])
                                .name((String) obj[1])
                                .description((String) obj[2])
                                .capacity((Integer) obj[3])
                                .memberCnt((Integer) obj[4])
                                .likes((Long) obj[5])
                                .url((String) obj[6])
                                .mapType((Integer) obj[7])
                                .build();

                        UserGarden master = userGardenRepository.findUserGardenByGardenIdAndGardenRole(gardenDto.getGardenId(), GardenRole.MASTER);
                        if (master != null && master.getUser() != null && master.getUser().getTree() != null) {
                            gardenDto.setMaster(master.getUser().getTree().getName());
                        }

                        return gardenDto;
                    })
                    .collect(Collectors.toList());

            return new PageImpl<>(gardens, pageable, result.getTotalElements());
        } catch (Exception e) {
            log.error("좋아요 랭킹 목록 조회 Error : ", e);
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "좋아요 랭킹 목록 조회 에러");
        }

    }

}
