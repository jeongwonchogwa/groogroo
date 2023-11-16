package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Garden;
import com.jwcg.groogroo.model.entity.GardenRole;
import com.jwcg.groogroo.model.entity.JoinState;
import com.jwcg.groogroo.model.entity.UserGarden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface UserGardenRepository extends JpaRepository<UserGarden, Long> {
    UserGarden findUserGardenByUserIdAndGardenId(long userId, long gardenId);

    UserGarden findUserGardenByGardenIdAndGardenRole(long gardenId, GardenRole gardenRole);
    List<UserGarden> findAllByUserId(long userId);

    List<UserGarden> findAllByUserIdAndDeleteDateIsNull(Long userId);

    List<UserGarden> findAllByGardenIdAndGardenRoleIn(Long gardenId, Collection<GardenRole> roles);

    List<UserGarden> findAllByGardenId(long gardenId);

    List<UserGarden> findAllByGardenIdAndJoinStateAndDeleteDateIsNull(Long gardenId, JoinState joinState);
}
