package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tree_user_preset")
@Schema(description = "Tree_user_preset")
public class TreeUserPreset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tree_user_preset_id")
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 양방향 매핑을 위한 setter
    public void setUser(User user) {
        if (user != null) {
            if (user.getTreeUserPresets() == null) {
                user.setTreeUserPresets(new ArrayList<>());
            }
            user.getTreeUserPresets().remove(this);
        }
        this.user = user;
        assert user != null;
        user.getTreeUserPresets().add(this);
    }

}
