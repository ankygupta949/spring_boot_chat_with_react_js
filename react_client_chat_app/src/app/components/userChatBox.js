import React from 'react';
import {bindActionCreators} from "redux";
import {setStompClient} from "../actions/StompClientAction";
import connect from "react-redux/es/connect/connect";


class UserChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.myInputRef=React.createRef();


    }

    render() {
        console.log(this.props.receiver.username)
        return (<form>
                <br/>
                <input type="text" ref={this.myInputRef}/>
                <button onClick={(e)=>this.handleSendMessageOnClick(e)}>send message</button>
            </form>
        )
    }

    handleSendMessageOnClick=(e)=>{
        this.props.myStompClient.send()
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


export default connect(mapStateToProps, mapDispatchToProps)(UserChatBox)