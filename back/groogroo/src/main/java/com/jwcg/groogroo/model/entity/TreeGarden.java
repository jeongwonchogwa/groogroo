package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tree_garden")
@Schema(description = "Tree_garden")
@ToString(exclude = {"tree", "garden"})
public class TreeGarden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tree_garden_id")
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "x")
    private int x;

    @Column(name = "y")
    private int y;

    @ManyToOne
    @JoinColumn(name = "tree_id")
    private Tree tree;

    @ManyToOne
    @JoinColumn(name = "garden_id")
    private Garden garden;

    // 양방향 매핑을 위한 setter
    public void setTree(Tree tree) {
        if (tree != null) {
            if (tree.getTreeGardens() == null) {
                tree.setTreeGardens(new ArrayList<>());
            }
            tree.getTreeGardens().remove(this);
        }
        this.tree = tree;
        assert tree != null;
        tree.getTreeGardens().add(this);
    }

    public void setGarden(Garden garden) {
        if (garden != null) {
            if (garden.getTreeGardens() == null) {
                garden.setTreeGardens(new ArrayList<>());
            }
            garden.getTreeGardens().remove(this);
        }
        this.garden = garden;
        assert garden != null;
        garden.getTreeGardens().add(this);
    }
}
