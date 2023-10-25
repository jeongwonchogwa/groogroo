package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.UserGarden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGardenRepository extends JpaRepository<UserGarden, Long> {
    UserGarden findUserGardenByUserIdAndGardenId(long userId, long gardenId);

    List<UserGarden> findAllByUserId(long userId);

    UserGarden findUserGardenById(Long userGardenId);
}
