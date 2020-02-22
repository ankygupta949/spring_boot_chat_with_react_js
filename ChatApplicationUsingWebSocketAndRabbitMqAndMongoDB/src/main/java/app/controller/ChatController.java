package app.controller;

import app.model.ChatMessage;
import app.model.GroupMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.stream.Collectors;




@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    /*-------------------below 4 API's are accessed by react_client_chat_application-------------------------*/


    @MessageMapping("/sendMessage")
    @SendTo("/topic/pubic") // (used to send the message to topic)
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        logger.info("ChatController -------> sendMessage");
        return chatMessage;
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/pubic")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {

        logger.info("ChatController -------> addUser");

        // Add user in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());

        //convertAndSend method is same as @sendTo
        //but @sendTo method doesn't work with clent at different port
        //so we used convertAndSend method
        simpMessagingTemplate.convertAndSend("/topic/public", chatMessage);

        return chatMessage;
    }

    @MessageMapping("/sendPrivateMessage")
    //@SendTo("/queue/reply")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        logger.info("ChatController -------> sendPrivateMessage");
        logger.info("ChatController -------> sendPrivateMessage-----> username -> " + chatMessage.getReceiver());

        //we used convertAndSendToUser(chatMessage.getReceiver().trim().toLowerCase(), "/reply", chatMessage);
        //so Spring will automatically prepend "/user/" + chatMessage.getReceiver().trim().toLowerCase() to the
        // destination,
        // if username is vksh hence it resolves into
        // "/user/vksh/reply"


        String address = "/reply";
        simpMessagingTemplate.convertAndSendToUser(
                chatMessage.getReceiver().trim().toLowerCase(), address, chatMessage);
        //return chatMessage;
    }

    @MessageMapping("/addPrivateUser")
    // @SendTo("/queue/reply")
    public ChatMessage addPrivateUser(@Payload ChatMessage chatMessage,
                                      SimpMessageHeaderAccessor headerAccessor) {
        logger.info("ChatController -------> addPrivateUser");

        // Add user in web socket session
        headerAccessor.getSessionAttributes().put("private-username", chatMessage.getSender());
        return chatMessage;
    }






    /*-------------------below 3 API's are accessed by react_client_chat_app-------------------------*/

    @MessageMapping("/addChatUser")
    public GroupMessage addChatUser(@Payload GroupMessage groupMessage,
                               SimpMessageHeaderAccessor headerAccessor) {

        logger.info("ChatController -------> addUser");

        // Add user in web socket session
        groupMessage.getUsers().forEach(it->{

            headerAccessor.getSessionAttributes().put("username",it.getUsername());
        });
        simpMessagingTemplate.convertAndSend("/topic/public", groupMessage);

        return groupMessage;
    }


    @MessageMapping("/addGroupUsers")
    // @SendTo("/queue/reply")
    public void addGroupUsers(@Payload GroupMessage groupMessage,
                              SimpMessageHeaderAccessor headerAccessor) {
        logger.info("ChatController -------> addGroupUsers");

        groupMessage.getUsers().forEach(user -> {
            // Add user in web socket session
            headerAccessor.getSessionAttributes().put("Group-username", user);
        });
        System.out.println("group message user list => "+groupMessage.getUsers());
        List<String> usernames=groupMessage.getUsers().stream().map(it->it.getUsername()).collect(Collectors.toList());
        usernames.forEach(it -> {

            simpMessagingTemplate.convertAndSendToUser(it.toLowerCase(), "/reply", groupMessage);
        });
    }

    @MessageMapping("/send/GroupMessage")
    //@SendTo("/queue/reply")
    public void sendGroupMessage(@Payload GroupMessage groupMessage) {
        logger.info("ChatController -------> sendGroupMessage");

        //note : we are sending the msg to topic with prefix (/group) because we created this topic by mentioned
        //in WebSocketConfig.java class
        //if we don't mention ,msg will not be sent because topic would not be created.
        simpMessagingTemplate.convertAndSend("/group/" + groupMessage.getGroupName(), groupMessage);
    }
}
