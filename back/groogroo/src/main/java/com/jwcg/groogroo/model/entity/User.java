package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user")
@Schema(description = "User")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "cancel")
    private boolean cancel;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole userRole;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "provider")
    private String provider;

    @OneToOne(mappedBy = "user")
    private Tree tree;

    @OneToMany(mappedBy = "user")
    private final List<UserGarden> userGardens = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private final List<UserFlower> userFlowers = new ArrayList<>();


}
