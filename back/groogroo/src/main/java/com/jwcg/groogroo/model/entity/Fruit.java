package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "fruit")
@Schema(description = "Fruit")
public class Fruit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fruit_id")
    private Long id;

    @Column(name = "writer")
    private Long writerId;

    @Column(name = "content")
    private String content;

    @Column(name = "fruit_type")
    private int type;

    @ManyToOne
    @JoinColumn(name = "tree_id")
    private Tree tree;

    // setter
    public void setTree(Tree tree){
        if (tree != null) {
            tree.getFruits().remove(this);
        }
        this.tree = tree;
        assert tree != null;
        tree.getFruits().add(this);
    }
}
