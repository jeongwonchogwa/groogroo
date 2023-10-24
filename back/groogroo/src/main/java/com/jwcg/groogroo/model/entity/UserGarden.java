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
@Table(name = "user_garden")
@Schema(description = "User_garden")
@ToString(exclude = {"flowers", "garden", "user"})
public class UserGarden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_garden_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private GardenRole gardenRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private JoinState joinState;

    @Column(name = "delete_date")
    private LocalDate deleteDate;

    @OneToMany(mappedBy = "userGarden")
    private List<Flower> flowers = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "garden_id")
    private Garden garden;

    // 양방향 매핑을 위한 setter
    public void setUser(User user) {
        if (user != null) {
            if (user.getUserGardens() == null) {
                user.setUserGardens(new ArrayList<>());
            }
            user.getUserGardens().remove(this);
        }
        this.user = user;
        assert user != null;
        user.getUserGardens().add(this);
    }

    public void setGarden(Garden garden) {
        if (garden != null) {
            if (garden.getUserGardens() == null) garden.setUserGardens(new ArrayList<>());
            else garden.getUserGardens().remove(this);
        }
        this.garden = garden;
        assert garden != null;
        garden.getUserGardens().add(this);
    }

}
