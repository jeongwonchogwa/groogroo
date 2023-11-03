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
@Table(name = "flower")
@Schema(description = "Flower")
public class Flower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flower_id")
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "writer_nickname")
    private String writerNickname;

    @Column(name = "x")
    private int x;

    @Column(name = "y")
    private int y;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @ManyToOne
    @JoinColumn(name = "user_garden_id")
    private UserGarden userGarden;

    // setter
    public void setUserGarden(UserGarden userGarden) {
        if (userGarden != null) {
            userGarden.getFlowers().remove(this);
        }
        this.userGarden = userGarden;
        assert userGarden != null;
        userGarden.getFlowers().add(this);
    }

}
