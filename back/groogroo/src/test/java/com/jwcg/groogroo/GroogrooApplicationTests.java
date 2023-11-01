package com.jwcg.groogroo;

import com.jwcg.groogroo.model.entity.GardenLike;
import com.jwcg.groogroo.model.entity.Notification;
import com.jwcg.groogroo.model.entity.NotificationType;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.service.GardenLikeService;
import com.jwcg.groogroo.repository.EmitterRepository;
import com.jwcg.groogroo.repository.EmitterRepositoryImpl;
import com.jwcg.groogroo.repository.GardenLikeRepository;
import com.jwcg.groogroo.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@SpringBootTest
@WebAppConfiguration
class GroogrooApplicationTests {

}
