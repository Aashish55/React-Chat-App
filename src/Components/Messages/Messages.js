import React from "react";
import { Segment, Comment } from 'semantic-ui-react'
import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import firebase from '../../firebase'
import MessageComponent from './MessageComponent';

class Messages extends React.Component {

  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messageLoading: true,
    numUniqueUsers:''
  }

  componentDidMount() {
    const { channel, user } = this.state

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListeners(channelId)
  }

  addMessageListeners = channelId => {
    let loadedMessages = []
    this.state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val())
      this.setState({
        messages: loadedMessages,
        messageLoading: false
      })
      this.countUniqueUsers(loadedMessages)
    })
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc,message)=>{
      if(!acc.includes(message.user.name)){
        acc.push(message.user.name)
      }
      return acc;
    },[])
    const plural = uniqueUsers.length>1 || uniqueUsers.length===0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural?'s':''}`;
    this.setState({numUniqueUsers})
  }

  displayChannelName = channel => channel ? `# ${channel.name}` : '';

  render() {

    const { messagesRef, messages, channel, user, numUniqueUsers } = this.state

    return (
      <React.Fragment>

        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
        />

        <Segment className='chatbox'>
          <Comment.Group className='messages'>
            {messages.length > 0 && messages.map(message =>
              <MessageComponent
                key={message.timestamp}
                message={message}
                user={user}
              />)}
          </Comment.Group>
        </Segment>

        <MessagesForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />

      </React.Fragment>
    );
  }
}

export default Messages;
