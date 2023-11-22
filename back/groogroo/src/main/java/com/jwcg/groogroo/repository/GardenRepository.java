package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Garden;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GardenRepository extends JpaRepository<Garden, Long> {

    Garden findGardenById(long gardenId);

    boolean existsByUrl(String url);

//    @Query("SELECT NEW com.jwcg.groogroo.model.dto.garden.ResponseGardenRankingDto" +
//            "(g.id, g.name, g.description, g.capacity, g.memberCnt, count(gl) likes, g.url, g.mapType) " +
//            "FROM Garden g " +
//            "LEFT JOIN MySQLGardenLike gl ON g.id = gl.gardenId " +
//            "GROUP BY g.id " +
//            "ORDER BY likes DESC")
@Query(value = "SELECT g.garden_id as gardenId, g.name, g.description, g.capacity, g.member_count as memberCnt, COUNT(gl.garden_id) as likes, g.url, g.map_type as mapType " +
        "FROM garden g LEFT JOIN garden_like gl ON g.garden_id = gl.garden_id " +
        "GROUP BY g.garden_id " +
        "ORDER BY likes DESC",
        countQuery = "SELECT COUNT(*) FROM garden",
        nativeQuery = true)
    Page<Object[]> findAllOrderByLikes(Pageable pageable);


}
