package com.jwcg.groogroo.config.redis;

import com.jwcg.groogroo.model.entity.GardenLike;
import com.jwcg.groogroo.model.entity.MySQLGardenLike;
import com.jwcg.groogroo.repository.GardenLikeRepository;
import com.jwcg.groogroo.repository.MySQLGardenLikeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class RedisExpirationListener implements MessageListener {

    @Autowired
    GardenLikeRepository gardenLikeRepository;
    @Autowired
    MySQLGardenLikeRepository mySQLGardenLikeRepository;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = new String(message.getBody());

        // TTL이 만료된 키가 GardenLike 엔티티인 경우에만 처리
        if (expiredKey.startsWith("GardenLike:") && expiredKey.contains("/")) {
            String gardenLikeId = expiredKey.replace("GardenLike:", "");

            String[] tokens = gardenLikeId.split("/");

            log.info("user id : " + tokens[0]);
            log.info("garden id : " + tokens[1]);

            if (!mySQLGardenLikeRepository.existsByUserIdAndGardenId(Long.parseLong(tokens[0]), Long.parseLong(tokens[1]))){
                // GardenLike 엔티티를 MySQL로 백업
                MySQLGardenLike mysqlEntity = MySQLGardenLike.builder()
                        .userId(Long.parseLong(tokens[0]))
                        .gardenId(Long.parseLong(tokens[1]))
                        .build();

                log.info("Garden Like update to MySQL : User {} like Garden {}", mysqlEntity.getUserId(), mysqlEntity.getGardenId());
                mySQLGardenLikeRepository.save(mysqlEntity);
            }else {
                log.info("Garden Like info already exists in MySQL : User {} like Garden {}", tokens[0], tokens[1]);
            }

            log.info("GardenLike with ID '{}' has expired at {}", gardenLikeId, LocalDateTime.now());
        }

    }
}