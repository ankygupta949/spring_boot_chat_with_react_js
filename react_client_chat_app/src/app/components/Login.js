import React from 'react';
import MyChatBox from "./chatBox";

export class Login extends React.Component {

    constructor(props){
        super(props);
        this.state={
            username : '',
            chatType : 'JOIN'
        };
        this.usernameRef = React.createRef();

    }

    render(){
        if(this.state.username){
            return(
                <MyChatBox username = {this.state.username} chatType = {this.state.chatType}/>
            )
        }
        return(
            <div>
                <form>
                    <input type='text' ref={this.usernameRef}/>
                    <input type='submit' onClick={(e)=>{
                        this.handleClick(e)
                    }}/>
                </form>
            </div>
        )
    }

    handleClick=(e)=>{
        e.preventDefault();
        this.setState({username : this.usernameRef.current.value})
    }
}