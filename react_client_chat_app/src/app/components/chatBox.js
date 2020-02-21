import React from 'react';
import {setStompClient} from "../actions/StompClientAction";
import {bindActionCreators} from "redux";
import connect from "react-redux/es/connect/connect";
import GroupBox from "./GroupMessageBox";
import UserChatBox from "./userChatBox";

var incrementNo = 3;

class MyChatBox extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            currentUser: {id: incrementNo + 1, username: this.props.username},
            chatType: this.props.chatType,
            chatMessages: [],
            chatStompClient: null,
            notify: false,
            userType: 'USER',
            isOpenGroupForm: false,
            selectedOnlineUser: null,
            onlineChatUsers: [
                {
                    id: 1, username: 'ankit', userType: 'USER', messages: [{
                        sender: 'A',
                        type: 'JOIN',
                        content: 'Hello Ankit',
                    }]
                },
                {
                    id: 2, username: 'group1', userType: 'GROUP', messages: [{
                        sender: 'B',
                        type: 'GROUP',
                        content: 'Hello API'
                    }],
                    userList: []
                },
            ]
        };
    }

    componentDidMount() {
        console.log("MyChatBox ---> componentDidMount called");
        //let currentUser = {id: incrementNo + 1, username: this.props.username};
        this.state.onlineChatUsers.push(this.state.currentUser)
       // this.state.currentUser = currentUser;
        this.props.setStompClient(this.props.username);
    }

    openFormCallback = (childData) => {
        this.setState({isOpenGroupForm: childData})
    }

    render() {


        if (this.state.isOpenGroupForm) {
            return (
                <div>
                    <GroupBox setOpenGroupFormCallback={this.openFormCallback}
                              onlineChatUsers={this.state.onlineChatUsers}/>
                </div>
            )
        }
        else {
            console.log("MyChatBox ---> render called");
            //this.state.chatStompClient.connect doesn't work with onclick event,it is working only with onPage event
            if (!this.state.chatStompClient) {
                this.state.chatStompClient = this.props.myStompClient;
                if (this.state.chatStompClient) {
                    console.log("connecting------------");
                    this.state.chatStompClient.connect({}, this.onConnected, this.onError);
                }
            }


            console.log("chatMessages size ===> " + this.state.chatMessages.length);
            const chatUI = this.state.chatMessages.map(it => {
                return <p key={it}>{it}</p>
            });
            console.log("userList size =====>" + this.state.onlineChatUsers.length)
            const onlineUsers = this.state.onlineChatUsers.map(it => {
                return <p key={it.id} id={it.id} onClick={(e) => this.handleSendMessageToUser(e)}>{it.username}</p>;
            })


            return (<div>
                <h1>{this.state.currentUser.username}</h1>
                {this.state.selectedOnlineUser ?
                    <UserChatBox receiver={this.state.selectedOnlineUser} sender={this.state.currentUser}/>
                    : <div>error</div>}

                {chatUI}
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <button onClick={(e) => this.addGroupUsers(e)}>create new group</button>
                <br/>
                <br/>
                <br/>
                <br/>
                <p>online users</p>
                {onlineUsers}
            </div>);
        }

    }

    handleSendMessageToUser = (e) => {
        var id = e.target.id;
        console.log(id);
        let selectedUser = this.state.onlineChatUsers.find(it => it.id == id);
        console.log(selectedUser.username)
        this.setState({selectedOnlineUser: selectedUser})
    }

    onConnected = () => {
        console.log("MyChatBox ---> onConnected called");

        // topic with prefix "/topic" was created in WebSocketConfig.java class
        this.state.chatStompClient.subscribe("/topic/public", this.onMessageReceived);

        this.state.chatStompClient.send("/app/addUser", {}, JSON.stringify({
            sender: this.state.currentUser.username,
            type: this.state.chatType
        }));

        this.state.chatStompClient.subscribe("/user/" + this.state.currentUser.username + "/reply", this.onUserMessageReceived);


    };

    onUserMessageReceived = (payload) => {
        console.log("MyChatBox ---> onUserMessageReceived called");
        var message = JSON.parse(payload.body);
        if (message.type == 'GROUP_JOIN') {
            console.log("MyChatBox ---> onUserMessageReceived called GROUP Type");
            this.state.onlineChatUsers.push({id: incrementNo + 1, username: message.groupName})
            this.subscribeGroup(message);
            this.setState({notify: true});
        }
        else {

        }
    };

    subscribeGroup = (message) => {

        //topic with prefix "/group" was created in WebSocketConfig.java class
        this.state.chatStompClient.subscribe("/group/" + message.groupName, this.onGroupMessageReceived);
        this.sendMessageToGroup(message);
    }


    sendMessageToGroup = (message) => {
        this.state.chatStompClient.send("/app/send/GroupMessage", {}, JSON.stringify({
            sender: this.state.currentUser.username,
            type: message.type,
            groupName: message.groupName
        }))
    }

    onMessageReceived = (payload) => {
        console.log("MyChatBox ---> onMessageReceived called");

        var message = JSON.parse(payload.body);
        if (message.type == 'JOIN') {
            console.log("MyChatBox ---> onMessageReceived called type JOIN");

            this.state.chatMessages.push(message.sender + " has joined");
            if (message.sender != this.props.username) {
                this.state.onlineChatUsers.push({username: message.sender});
            }
            this.setState({notify: true});
        }


    }

    onError() {
        console.log("MyChatBox ---> onError called");
        return (
            <div>
                error
            </div>
        )
    }


    addGroupUsers = (e) => {
        this.setState({isOpenGroupForm: true});

    }

    onGroupMessageReceived = (payload) => {
        console.log("MyChatBox ---> onGroupMessageReceived called" + payload);
    }


}


function mapDispatchToProps(dispatch) {
    console.log("called mapDispatchToProps");
    return bindActionCreators({
        setStompClient
    }, dispatch)
}


function mapStateToProps(state) {
    console.log("called mapStateToProps")
    return {
        myStompClient: state.stmpCltReducer.stompClient,
        customUserList: state.stmpCltReducer.userList
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyChatBox)