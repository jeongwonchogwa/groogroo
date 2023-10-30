package com.jwcg.groogroo.model.entity;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@Setter
@AllArgsConstructor
@Builder
@RedisHash(value = "GardenLike", timeToLive = 60)
public class GardenLike {

    @Id
    private String id;

    @Indexed
    private long userId;

    @Indexed
    private long gardenId;
}
