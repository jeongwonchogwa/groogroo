package com.jwcg.groogroo.model.dto.flower;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseFlowerDto {
 private long id;
 private long writerId;
 private String writerNickName;
 private String content;
 private String imageUrl;
 private String createTime;
}
