const initState = {
    onlineChatUsers: [
        {
            id: 1, username: 'ankit', userType: 'USER', messages: [{
                sender: 'A',
                type: 'JOIN',
                content: 'Hello Ankit'
            }]
        },
        {
            id: 2, username: 'group1', userType: 'GROUP', messages: [{
                sender: 'B',
                type:'GROUP_JOIN',
                content: 'Hello Ankit'
            }],
            userList: []
        },
    ]
}

export const myUserReducer = (state = initState, action) => {
    console.log("myUserReducer is called");
    if (action.type == 'ADD_USER') {
        console.log("myUserReducer ADD_USER action is called");

        if (action.user != null) {
            return {
                onlineChatUsers: [...state.onlineChatUsers, action.user]
            }
        }
    }

    return state;
}