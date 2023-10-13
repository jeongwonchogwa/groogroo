package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "garden")
@Schema(description = "Garden")
public class Garden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "garden_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "url")
    private String url;

    @OneToMany(mappedBy = "garden")
    private final List<UserGarden> userGardens = new ArrayList<>();

    @OneToMany(mappedBy = "garden")
    private final List<TreeGarden> treeGardens = new ArrayList<>();

    @OneToMany(mappedBy = "garden")
    private final List<Flower> flowers = new ArrayList<>();
}
