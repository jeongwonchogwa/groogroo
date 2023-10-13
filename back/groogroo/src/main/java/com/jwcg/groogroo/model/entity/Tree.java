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
@Table(name = "tree")
@Schema(description = "Tree")
public class Tree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tree_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "garden_id")
    private Long gardenId;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "tree")
    private final List<Fruit> fruits = new ArrayList<>();

    // setter
    public void setUser(User user) {
        if (user != null) {
            user.getTrees().remove(this);
        }
        this.user = user;
        assert user != null;
        user.getTrees().add(this);
    }
}
