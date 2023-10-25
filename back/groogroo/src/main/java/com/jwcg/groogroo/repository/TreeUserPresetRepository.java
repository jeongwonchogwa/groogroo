package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.TreeUserPreset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TreeUserPresetRepository extends JpaRepository<TreeUserPreset, Long> {

    List<TreeUserPreset> findAllByUserId(long userId);

}
