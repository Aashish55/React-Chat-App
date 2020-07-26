import React, { Component } from 'react';
import { Segment, Button, Input, Form } from 'semantic-ui-react'
import firebase from '../../firebase'
import FileModal from './FileModal'
import uuidv4 from 'uuid/v4';
import Progressbar from './Progressbar'

class MessagesForm extends Component {
    state = {
        storageRef: firebase.storage().ref(),
        uploadTask: null,
        uploadState: '',
        message: '',
        channel: this.props.currentChannel,
        loading: false,
        user: this.props.currentUser,
        errors: [],
        modal: false,
        percentUploaded: 0
    }

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false })

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }


    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };
        if (fileUrl !== null) {
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message
        }

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

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                    this.setState({ percentUploaded })
                },
                    err => {
                        console.log(err)
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask: null
                        })
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            this.sendFileMessage(downloadUrl, ref, pathToUpload)
                        })
                            .catch(err => {
                                console.log(err)
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: 'error',
                                    uploadTask: null
                                })
                            })
                    }
                )
            }
        )
    };

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(() => {
            this.setState({ uploadState: 'done' })
        })
            .catch(err => {
                console.log(err)
                this.setState({
                    errors: this.state.errors.concat(err),

                })
            })
    }



    render() {
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state
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
                        <Button color='teal' content='Upload Media' disabled={uploadState==='uploading'} onClick={this.openModal} labelPosition='right' icon='cloud upload'></Button>
                    </Button.Group>
                    <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile}
                    />
                    <Progressbar 
                        uploadState={uploadState}
                        percentUploaded={percentUploaded}
                    />
                </Form>
            </Segment>
        );
    }
}

export default MessagesForm;