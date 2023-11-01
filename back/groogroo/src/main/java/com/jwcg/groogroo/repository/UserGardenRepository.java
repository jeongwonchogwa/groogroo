package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Garden;
import com.jwcg.groogroo.model.entity.GardenRole;
import com.jwcg.groogroo.model.entity.UserGarden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGardenRepository extends JpaRepository<UserGarden, Long> {
    UserGarden findUserGardenByUserIdAndGardenId(long userId, long gardenId);

    List<UserGarden> findAllByUserId(long userId);

    List<UserGarden> findAllByUserIdAndDeleteDateIsNull(Long userId);

    List<UserGarden> findAllByGardenIdAndGardenRoleOrGardenRole(long gardenId, GardenRole gardenRole1, GardenRole gardenRole2);

    List<UserGarden> findAllByGardenId(long gardenId);

}
