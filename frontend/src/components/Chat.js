import React from 'react';
import { connect } from 'react-redux';
import WebSocketInstance from '../websocket';
import Hoc from '../hoc/hoc';

import Current_user from '../assets/current_user.webp';
import Others_users from '../assets/others_users.png';


class Chat extends React.Component {

    state = { message: '' }

    initialiseChat() {
        this.waitForSocketConnection(() => {
            WebSocketInstance.fetchMessages(
                this.props.username,
                this.props.match.params.chatID
            );
        });
        WebSocketInstance.connect(this.props.match.params.chatID);
    }

    constructor(props) {
        super(props);
        this.initialiseChat();

    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function () {
                if (WebSocketInstance.state() === 1) {
                    console.log("Connection is made");
                    callback();
                    return;
                } else {
                    console.log("wait for connection...");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    messageChangeHandler = (event) => {
        this.setState({
            message: event.target.value
        })
    }

    sendMessageHandler = (e) => {
        e.preventDefault();
        const messageObject = {
            from: this.props.username,
            content: this.state.message,
            chatId: this.props.match.params.chatID
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({ message: '' });
    }

    renderTimestamp = timestamp => {
        let prefix = '';
        const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime()) / 60000);
        if (timeDiff < 1) { // less than one minute ago
            prefix = 'just now...';
        } else if (timeDiff < 60 && timeDiff > 1) { // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24 * 60 && timeDiff > 60) { // less than 24 hours ago
            prefix = `${Math.round(timeDiff / 60)} hours ago`;
        } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) { // less than 7 days ago
            prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix
    }

    renderMessages = (messages) => {
        const currentUser = this.props.username;
        return currentUser && messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{ marginBottom: arr.length - 1 === i ? '300px' : '15px' }}
                className={message.author === currentUser ? 'replies' : 'sent'}>
                <img
                    src={message.author === currentUser ? Current_user : Others_users}
                    alt=""
                />
                <p>{message.content}
                    <br />
                    {message.author === currentUser ?
                        <small> {`${this.renderTimestamp(message.timestamp)}`}</small>
                        :
                        <small> {`${message.author} ${this.renderTimestamp(message.timestamp)}`}</small>
                    }
                </p>
            </li>
        ));
    }

    messagesEndRef = React.createRef();
    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    componentDidMount() {
        this.scrollToBottom();
    }


    componentDidUpdate(prevProps, prevState) {
        this.scrollToBottom();
        if (this.props.match.params.chatID !== prevProps.match.params.chatID) {
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    prevProps.username,
                    this.props.match.params.chatID
                );
            });
            WebSocketInstance.connect(this.props.match.params.chatID);
        }
    }


    render() {
        const messages = this.props.messages;
        return (
            <Hoc>
                <div className="messages">
                    <ul id="chat-log">
                        {
                            messages && this.renderMessages(messages)
                        }

                        <div
                            style={{ float: "left", clear: "both" }}
                            ref={this.messagesEndRef}
                        >
                        </div>
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required
                                id="chat-message-input"
                                type="text"
                                placeholder="Write your message..." />
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </Hoc>
        );
    };
}

const mapStateToProps = state => {

    return {
        username: state.auth.username,
        messages: state.message.messages
    }
}

export default connect(mapStateToProps)(Chat);