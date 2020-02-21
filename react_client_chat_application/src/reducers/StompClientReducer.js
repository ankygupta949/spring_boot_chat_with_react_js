const initState = {
     StompClient : null
}

const StompClientReducer = (state = initState, action) => {
    if (action.type == 'ADD_STOMP_CLIENT') {
        console.log("called studentReducer with action type ADD_STUDENT")

        return {
            stompClient : action.customStompClient
        };

    }
    console.log("called studentReducer without action type")
    return state;
}

export default StompClientReducer;