package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Tree;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TreeRepository extends JpaRepository<Tree, Long> {

    Tree findTreeByUserId(long userId);

    boolean existsByName(String name);

    List<Tree> findByNameLike(String name);
}
