package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "garden")
@Schema(description = "Garden")
@ToString(exclude = {"userGardens", "treeGardens"})
public class Garden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "garden_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "url")
    private String url;

    @Column(name = "capacity")
    private int capacity;

    @Column(name = "member_count")
    private int memberCnt;

    @Column(name = "delete_date")
    private LocalDate deleteDate;

    @OneToMany(mappedBy = "garden")
    private List<UserGarden> userGardens = new ArrayList<>();

    @OneToMany(mappedBy = "garden")
    private List<TreeGarden> treeGardens = new ArrayList<>();

}
