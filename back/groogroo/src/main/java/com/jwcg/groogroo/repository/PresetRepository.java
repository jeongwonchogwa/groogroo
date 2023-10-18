package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.ContentType;
import com.jwcg.groogroo.model.entity.Preset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresetRepository extends JpaRepository<Preset, Long> {

    List<Preset> findAllByContentType(ContentType type);

}
