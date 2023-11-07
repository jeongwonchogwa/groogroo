package com.jwcg.groogroo.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user")
@Schema(description = "User")
@ToString(exclude = {"userGardens", "treeUserPresets", "tree"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus userStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole userRole;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "provider")
    private String provider;

    @JsonBackReference
    @OneToOne
    @JoinColumn(name = "tree_id")
    private Tree tree;

    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<UserGarden> userGardens = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<TreeUserPreset> treeUserPresets = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "receiver")
    private List<Notification> notifications = new ArrayList<>();

}
