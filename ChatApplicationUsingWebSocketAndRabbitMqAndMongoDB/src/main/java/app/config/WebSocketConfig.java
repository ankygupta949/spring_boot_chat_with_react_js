package app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");

        registry.enableSimpleBroker("/queue", "/topic", "/user","/group");   // Enables a simple in-memory broker
        // note : above prefix like "/queue", "/topic", "/user","/group"
        // are used to create topic with prefix same as given here
        // otherwise topic will not created properly
        //so we created 4 topics with prefixe /queue , /topic , /user and /group
        registry.setUserDestinationPrefix("/user");


        //   Use this for enabling a Full featured broker like RabbitMQ or ActiveMQ

       /* registry.enableStompBrokerRelay("/topic")
                .setRelayHost("localhost")
                .setRelayPort(61613)
                .setClientLogin("guest")
                .setClientPasscode("guest");*/
    }
}
