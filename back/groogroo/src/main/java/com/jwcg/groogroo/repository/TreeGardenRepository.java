package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.TreeGarden;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreeGardenRepository extends JpaRepository<TreeGarden, Long> {
    TreeGarden findTreeGardenById(Long targetId);

    TreeGarden findTreeGardenByTreeIdAndGardenId(Long treeId, Long gardenId);
}
