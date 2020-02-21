import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Footer from '../footer/Footer'
import userImage from '../userImage.png';
import {connect} from "react-redux"; //connect is a method which will be used to get high order component


var stompClient = null;

class PrivateMessageBox extends Component {

    constructor(props) {
        super(props);
        this.connect()
        this.state = {
            open: this.props.open,
            broadcastMessage: [],
            openMessageBox: false,
            showFooter: true
        };
    };

    connect = () => {

        if (this.props.otherUser) {

            /* const Stomp = require('stompjs')

             var SockJS = require('sockjs-client')

             SockJS = new SockJS('/ws')

             stompClient = Stomp.over(SockJS);
       */
            stompClient = this.props.reduxStompClient;
          //  stompClient.connect({}, this.onConnected, this.onError);
            if (stompClient) {
                this.onConnected();
            }
            else {
                this.onError();
            }
        }
    }

    onConnected = () => {
        console.log("PrivateMessageBox.js ===========> onConnected()")
        // Subscribing to the private topic for getting private chat data (sent from this user to other user or vice versa)
        stompClient.subscribe('/user/' + this.props.otherUser.toString().toLowerCase() + '/reply', this.onMessageReceived);


        // Registering user to server as a private chat user
        stompClient.send('/app/addPrivateUser', {}, JSON.stringify({sender: this.props.otherUser, type: 'JOIN'}))

        console.log("footer getting true");
        this.setState({
            showFooter: true,
        })

    }

    sendMessage = (type, value) => {
        console.log("PrivateMessageBox.js ===========> sendMessage()")
        if (stompClient) {
            var chatMessage = {
                sender: this.props.youser,
                receiver: this.props.otherUser,
                content: type === 'TYPING' ? value : value,
                type: type

            };
            stompClient.send('/app/sendPrivateMessage', {}, JSON.stringify(chatMessage));

        }
    }

    onMessageReceived = (payload) => {

        var message = JSON.parse(payload.body);
        console.log("PrivateMessageBox.js ===========> onMessageReceived()")

        if (message.type === 'CHAT') {
            this.state.broadcastMessage.push({
                message: message.content,
                sender: message.sender,
                dateTime: message.dateTime
            })
            this.setState({
                broadcastMessage: this.state.broadcastMessage,
            })
        }
    }

    render() {

        return <div>

            <Dialog
                open={this.props.open}
                onClose={this.props.handleClose}
                aria-labelledby="responsive-dialog-title"
                onEscapeKeyDown={this.props.handleClose}
                autoScrollBodyContent={true}

            >
                <DialogTitle id="responsive-dialog-title">{"Send Private Message"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div><img src={userImage} alt="Default-User" id="userImage"/></div>
                        <div id="usernameDialogNotifications">
                            <h5>{this.props.otherUser}</h5>
                        </div>
                        <div>
                            <div><h5>Sent messages by You to {this.props.otherUser}</h5></div>
                            {this.state.broadcastMessage.map((msg, i) =>
                                <div>{this.props.youser === msg.sender ? msg.message : ""}</div>
                            )}

                        </div>
                    </DialogContentText>
                </DialogContent>


                {this.state.showFooter ? <Footer sendMessage={this.sendMessage} privateMessage={true}
                                                 connect={this.connect}/> : "Connecting to " + this.props.otherUser + "..."}
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    }
}

// mapStateToProps is used to fetch data (state) from reducer of redux store
// . this is called automatically if there is any update in data (state) of redux store
const mapStateToProps = (state) => {
    console.log("called mapStateToProps")
    return {
        reduxStompClient: state.stompClient
    };
}
//below connect method calls the reducer to get state
// and then calls the mapStateToProps with state to update the props
// after that render method is called
export default connect(mapStateToProps)(PrivateMessageBox);
