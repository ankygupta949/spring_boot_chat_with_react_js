import React  from 'react';
import {bindActionCreators} from "redux";
import {setStompClient} from "../actions/StompClientAction";
import connect from "react-redux/es/connect/connect";


class MyUserMessages extends React.Component{
    constructor(props){
        super(props)
    this.state={
            user : this.props.selectedUser
    }
    }


    render(){
        let messageUI=null;
        if(this.props.userList) {
            let user = this.props.userList.find(it => it.id == this.state.user.id);
             messageUI = user.messages.map(it => {
                return (<li key={it.sender}>{it.sender} : {it.content}</li>)
            })
        }

        return(
         <ul>{messageUI}</ul>
        )
    }




}




function mapStateToProps(state) {
    console.log("called mapStateToProps")
    return {
        userList: state.myUserReducer.onlineChatUsers,
    }
}


export default connect(mapStateToProps, null)(MyUserMessages)