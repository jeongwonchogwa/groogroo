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
@Table(name = "report")
@Schema(description = "Report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long id;

    @Column(name = "reporter_id")
    private Long reporterId;

    @Column(name = "content")
    private String content;

    @Column(name = "completed")
    private boolean completed;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ContentType contentType;

    @Column(name = "target_id")
    private Long targetId;
}
