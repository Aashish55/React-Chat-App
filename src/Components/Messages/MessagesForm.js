import React, { Component } from 'react';
import { Segment, Button, Input,Form } from 'semantic-ui-react'
import firebase from '../../firebase'

class MessagesForm extends Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        loading: false,
        user: this.props.currentUser,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }


    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };

        return message;
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state

        if (message) {
            this.setState({ loading: true })
            messagesRef.child(channel.id).push().set(this.createMessage()).then(() => {
                this.setState({ loading: false, message: '', errors: [] })
            })
                .catch(err => {
                    console.log(err)
                    this.state({ loading: false, errors: this.state.errors.concat(err) })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
            })
        }
    }

    render() {
        const { errors,message,loading } = this.state
        return (
            <Segment className='messages__form'>
                <Form onSubmit={this.sendMessage}>
                <Input
                fluid
                name='message'
                className={
                    errors.some(error => error.message.includes('message')) ? 'error' : ''
                }
                value={message}
                onChange={this.handleChange}
                style={{ marginBottom: '0.7em' }}
                label={<Button icon='add' />}
                labelPosition='left'
                placeholder='Add a Message...'
            />
            <Button.Group icon widths='2'>
                <Button color='orange' content='Add a Reply..' disabled={loading} onClick={this.sendMessage} labelPosition='left' icon='edit'></Button>
                <Button color='teal' content='Upload Media' labelPosition='right' icon='cloud upload'></Button>

            </Button.Group>
                </Form>
            </Segment>
        );
    }
}

export default MessagesForm;