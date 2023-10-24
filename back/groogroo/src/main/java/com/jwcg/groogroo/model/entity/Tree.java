package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tree")
@Schema(description = "Tree")
@ToString(exclude = {"fruits", "treeGardens", "user"})
public class Tree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tree_id")
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "name")
    private String name;

    @Column(name = "delete_date")
    private LocalDate deleteDate;

    @OneToOne(mappedBy = "tree")
    private User user;

    @OneToMany(mappedBy = "tree")
    private List<Fruit> fruits = new ArrayList<>();

    @OneToMany(mappedBy = "tree")
    private List<TreeGarden> treeGardens = new ArrayList<>();
}
