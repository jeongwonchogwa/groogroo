package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.concurrent.Flow;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user_flower")
@Schema(description = "User_flower")
public class UserFlower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_flower_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "flower_id")
    private Flower flower;

    // 양방향 매핑을 위한 setter
    public void setUser(User user) {
        if (user != null) {
            user.getUserFlowers().remove(this);
        }
        this.user = user;
        assert user != null;
        user.getUserFlowers().add(this);
    }

    public void setFlower(Flower flower) {
        if (flower != null) {
            flower.getUserFlowers().remove(this);
        }
        this.flower = flower;
        assert flower != null;
        flower.getUserFlowers().add(this);
    }
}
