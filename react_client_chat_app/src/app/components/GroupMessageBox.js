import React from "react";
import {bindActionCreators} from "redux";
import {setStompClient} from "../actions/StompClientAction";
import connect from "react-redux/es/connect/connect";


class GroupBox extends React.Component {

    constructor(props) {
        super(props);
        this.groupNameRef = React.createRef();
        this.state = {
            chatStompClient: null,
            selectedUsers: []
        }

    }

    handleCheck = (e) => {
        if (e.target.checked) {
this.state.selectedUsers.push({id:e.target.key,username : e.target.value})
        }
    }

    render() {

        this.state.chatStompClient = this.props.myStompClient;
        if (this.state.chatStompClient) {
            const onlineUsernameUI = this.props.onlineChatUsers.map(it => {
                return <p>{it.username} : <input type="checkbox" onChange={(e) => this.handleCheck(e)} key={it.id}
                                                 value={it.username}/></p>
            });
            return (
                <div>
                    <form>
                        <input type="text" ref={this.groupNameRef}/>
                        select users : {onlineUsernameUI}
                        <button onClick={(e) => this.createGroup(e)}>create Group</button>
                    </form>
                </div>
            )
        }
        else {
            return (
                <div>
                    error
                </div>
            )
        }
    }

    createGroup = (e) => {
        e.preventDefault();
        this.props.setStompClient(this.groupNameRef.current.value);
        //topic with prefix "/group" was created in WebSocketConfig.java class
        //   this.state.chatStompClient.subscribe("/group/group1",this.onGroupMessageReceived);
        var myUserList = this.state.selectedUsers.map(it => {
            return it.username;
        });
        console.log("GroupBox createGroup myUserList size"+myUserList.length);
        var groupMessage = {
            users: myUserList,
            type: 'GROUP_JOIN',
            groupName: this.groupNameRef.current.value
        }
        /* var chatMessages= new Array();
             this.state.userlist.map(it=>{

             var chatMessage= {sender: it.username, type: this.state.chatType};
         chatMessages.push(chatMessage);
             })*/
        this.state.chatStompClient.send("/app/addGroupUsers", {}, JSON.stringify(groupMessage));
        this.props.setOpenGroupFormCallback(false)
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


export default connect(mapStateToProps, mapDispatchToProps)(GroupBox)
