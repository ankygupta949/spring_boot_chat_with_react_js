function getStompClient(customUsername) {
    console.log("getStompClient Action called")
    const Stomp = require('stompjs');

    var SockJS = require('sockjs-client');
    SockJS = new SockJS('http://localhost:9256/ws');

    const stompClient = Stomp.over(SockJS);

    return{
        type : "ADD_STOMP_CLIENT",
        customStompClient : stompClient,
        user : {username : customUsername}
    }
}

export const setStompClient=(username)=>{
    return (dispatch)=>{
        return dispatch(getStompClient(username));
    }
}

