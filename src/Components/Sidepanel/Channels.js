import React, { Component } from 'react';
import { Menu, MenuItem, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'
import firebase from '../../firebase'

class Channels extends Component {
    state = {
        user:this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false
    }

    openModal = () => {
        this.setState({ modal: true })
    }

    closeModal = () => {
        this.setState({ modal: false })
    }


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    addChannel = () => {
        const { channelName, channelDetails, channelsRef, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details:channelDetails,
            createdBy:{
              name: user.displayName,
              avatar: user.photoURL
            }
        };
        channelsRef.child(key).update(newChannel).then(()=>{
            this.setState({channelName:'', channelDetails:''});
            this.setState({modal:false})
            console.log('Channel added successfully')
        })
        .catch(err=>{
            console.log(err)
        })
    }


    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    render() {
        const { channels, modal } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <MenuItem>
                        <span>
                            <Icon name='exchange' /> Channels
            </span>{"  "}
            ({channels.length}) <Icon name='add' inverted onClick={this.openModal} />
                    </MenuItem>

                </Menu.Menu>
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>
                        Add a Channel
            </Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label='Name of Channel'
                                    name='channelName'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label='About The Channel'
                                    name='channelDetails'
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted onClick={this.handleSubmit}>
                            <Icon name='checkmark' /> Add
            </Button>

                        <Button color='red' inverted onClick={this.closeModal}>
                            <Icon name='remove' /> Cancel
            </Button>

                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Channels;