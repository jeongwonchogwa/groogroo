package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

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
@ToString(exclude = "userGardens")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "status")
    @Comment("0: 일반 회원, 1: 탈퇴, 2: 차단")
    private int status;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole userRole;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "provider")
    private String provider;

    @OneToOne(mappedBy = "user", cascade = CascadeType.PERSIST)
    private Tree tree;

    @OneToMany(mappedBy = "user")
    private List<UserGarden> userGardens = new ArrayList<>();


}
