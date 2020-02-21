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

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    /*--------------------Private chat--------------------*/
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    /*-------------------- Group (Public) chat--------------------*/
    @MessageMapping("/sendMessage")
    @SendTo("/topic/pubic")
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
        groupMessage.getUsers().forEach(it -> {

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
