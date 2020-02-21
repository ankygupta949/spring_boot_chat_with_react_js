// addStudentAction calls the reducer and update or add the data
export const addStompClientAction = () => {
    console.log("called addStudentAction ");
    const Stomp = require('stompjs');

    var SockJS = require('sockjs-client');
    SockJS = new SockJS('/ws');

   const stompClient = Stomp.over(SockJS);

    return {
        type: 'ADD_STOMP_CLIENT',
        customStompClient: stompClient
    }
}