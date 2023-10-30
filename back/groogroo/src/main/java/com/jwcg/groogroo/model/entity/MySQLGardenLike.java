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
@Table(name = "garden_like")
@Schema(description = "Garden_like")
public class MySQLGardenLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "garden_like_id")
    private Long id;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "garden_id")
    private long gardenId;
}
