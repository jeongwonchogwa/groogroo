package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user_report")
@Schema(description = "UserReport")
public class UserReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_report_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter; // 신고한 유저

    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser; // 신고 당한 유저
}
