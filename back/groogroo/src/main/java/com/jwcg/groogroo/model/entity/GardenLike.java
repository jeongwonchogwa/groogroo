package com.jwcg.groogroo.model.entity;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@Setter
@AllArgsConstructor
@Builder
@RedisHash(value = "Ranking")
public class GardenLike {

    @Id
    private Long id;

    @Indexed
    private long userId;

    @Indexed
    private long gardenId;
}
