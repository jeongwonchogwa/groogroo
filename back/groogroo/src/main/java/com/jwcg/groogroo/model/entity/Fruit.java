package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "fruit")
@Schema(description = "Fruit")
@ToString(exclude = {"tree"})
public class Fruit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fruit_id")
    private Long id;

    @Column(name = "writer_id")
    private Long writerId;

    @Column(name = "content")
    private String content;

    @Column(name = "writer_nickname")
    private String writerNickname;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "delete_date")
    private LocalDate deleteDate;

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
