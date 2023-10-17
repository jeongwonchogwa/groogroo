package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tree")
@Schema(description = "Tree")
@ToString(exclude = {"fruits", "treeGardens"})
public class Tree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tree_id")
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "tree")
    private List<Fruit> fruits = new ArrayList<>();

    @OneToMany(mappedBy = "tree")
    private List<TreeGarden> treeGardens = new ArrayList<>();
}
