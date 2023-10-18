package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "preset")
@Schema(description = "Preset")
public class Preset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preset_id")
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ContentType contentType;
}
