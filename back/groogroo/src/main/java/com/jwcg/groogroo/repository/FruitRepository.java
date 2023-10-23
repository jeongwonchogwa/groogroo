package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Fruit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FruitRepository extends JpaRepository<Fruit, Long> {

    List<Fruit> findAllByTreeId(long treeId);

    Fruit findFruitById(long fruitId);


}
