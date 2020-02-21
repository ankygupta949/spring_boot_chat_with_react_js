const initState = {
    stompClient: null,
    userList: []
}

export const myStompClientReducer = (state = initState, action) => {
    console.log("myStompClientReducer is called");
    if (action.type == 'ADD_STOMP_CLIENT') {
        console.log("myStompClientReducer ADD_STOMP_CLIENT action is called");

        if (action.user != null) {
            return {
                stompClient: action.customStompClient,
                userList: [...state.userList, action.user]
            }
        }
        else {
            return {
                stompClient: action.customStompClient
            }
        }
    }

    return initState;
}