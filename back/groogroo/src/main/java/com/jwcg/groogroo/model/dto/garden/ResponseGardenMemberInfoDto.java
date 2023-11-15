package com.jwcg.groogroo.model.dto.garden;

import com.jwcg.groogroo.model.entity.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseGardenMemberInfoDto {

    private Long userId;
    private String treeName;
    private String gardenRole;

}
