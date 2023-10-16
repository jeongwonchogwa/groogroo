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

    @Column(name = "x")
    private int x;

    @Column(name = "y")
    private int y;

    @ManyToOne
    @JoinColumn(name = "garden_id")
    private Garden garden;

    @OneToMany(mappedBy = "flower")
    private final List<UserFlower> userFlowers = new ArrayList<>();

    // setter
    public void setGarden(Garden garden) {
        if (garden != null) {
            garden.getFlowers().remove(this);
        }
        this.garden = garden;
        assert garden != null;
        garden.getFlowers().add(this);
    }
}
