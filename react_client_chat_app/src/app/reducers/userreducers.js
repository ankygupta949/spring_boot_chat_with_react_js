const initState = {
    onlineChatUsers: [
        {
            id: 1, username: 'ankit', userType: 'USER', messages: [{
                sender: this.state.username,
                type: this.state.chatType,
                content: 'Hello Ankit'
            }]
        },
        {
            id: 2, username: 'group1', userType: 'GROUP', messages: [{
                sender: this.state.username,
                type: this.state.chatType,
                content: 'Hello Ankit'
            }],
            userList: []
        },
    ]
}

export const myUserReducer = (state = initState, action) => {
    console.log("myStompClientReducer is called");
    if (action.type == 'ADD_USER_MESSAGE') {
        console.log("myStompClientReducer ADD_STOMP_CLIENT action is called");

        if (action.user != null) {
            return {
                onlineChatUsers: [...state.onlineChatUsers, action.userMessage]
            }
        }
    }

    return initState;
}