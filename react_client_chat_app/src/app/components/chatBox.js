import React from 'react';
import MyUserMessages from './UserMessages'
import {setStompClient} from "../actions/StompClientAction";
import {setUser} from "../actions/AddUserAction";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var incrementNo = 3;

class MyChatBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        }

    }


    componentDidMount() {
        console.log("MyChatBox ---> componentDidMount called");
        let currentUser = {
            id: Math.random(), username: this.props.username, messages: [{
                sender: 'C',
                type: 'JOIN',
                content: 'Hello' + this.props.username
            }]
        };
        this.state.currentUser = currentUser;

        //this.props.setUser(this.state.currentUser)
        this.props.setStompClient(this.props.username);
    }

    render() {
        console.log("MyChatBox ---> render called");
        //this.state.chatStompClient.connect doesn't work with onclick event,it is working only with onPage event

        let onlineUsers = this.props.userList;
        console.log("online Users Length====>" + onlineUsers.length);
        if (!this.state.chatStompClient) {
            this.state.chatStompClient = this.props.myStompClient;
            if (this.state.chatStompClient) {
                console.log("connecting------------");
                this.state.chatStompClient.connect({}, this.onConnected, this.onError);
            }

        }
        return (
            <div>
                {this.state.currentUser ? <h1>{this.state.currentUser.username}</h1> : null}
                <MyUserMessages selectedUser={{id: 1}}/>
            </div>
        )
    }

    onConnected = () => {
        console.log("MyChatBox ---> onConnected called");

        this.state.chatStompClient.subscribe("/topic/public", this.onMessageReceived);
        var groupMessage = {
            type: 'JOIN',
            content: this.props.username + " has connected",
            users: [{id: Math.random(), username: this.props.username}],
            sender: this.props.username
        }
        this.state.chatStompClient.send("/app/addChatUser", {}, JSON.stringify(groupMessage))
    }

    onMessageReceived = (payload) => {
        var groupMessage = JSON.parse(payload.body);
        var users = new Array();
        groupMessage.users.forEach(u=>{
            var user ={};
            user.id=u.id;
            user.username=u.username;
            user.messages = [];
            user.messages.push(groupMessage.content);
            users.push(user);

        });
        users.forEach(it=>{

            this.props.setUser({it});
        })
        console.log(groupMessage.users.length);

    }

}

function mapDispatchToProps(dispatch) {
    console.log("called mapDispatchToProps");
    return bindActionCreators({
        setStompClient,
        setUser
    }, dispatch)
}


function mapStateToProps(state) {
    console.log("called mapStateToProps")
    return {
        userList: state.myUserReducer.onlineChatUsers,
        myStompClient: state.stmpCltReducer.stompClient,
        customUserList: state.stmpCltReducer.userList,

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyChatBox)