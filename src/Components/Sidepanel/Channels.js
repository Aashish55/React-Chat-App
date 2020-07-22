import React, { Component } from 'react';
import { Menu, MenuItem, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {setCurrentChannel} from '../../action'

class Channels extends Component {
    state = {
        user:this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad:true,
        activeChannel: ''
    }

    openModal = () => {
        this.setState({ modal: true })
    }

    closeModal = () => {
        this.setState({ modal: false })
    }


    componentDidMount(){
        this.addListeners();
    }

    addListeners= () =>{
        let loadedChannels = [];

        this.state.channelsRef.on('child_added',snap=>{
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel() );
        })
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length>0){
            this.props.setCurrentChannel(firstChannel);
            this.activeChannel(firstChannel);
        }
        this.setState({firstLoad:false})
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

    displayChannels = (channels) =>{
        return (
            channels.length>0 && channels.map(channel=>{
                return (
                    <Menu.Item key={channel.id} name={channel.name} active={channel.id===this.state.activeChannel} onClick={()=>this.changeChannel(channel)} style={{opacity:0.7}} >
                    #{channel.name}
                    </Menu.Item>
                );
            })
        );
    } 

    changeChannel =channel =>{
        this.activeChannel(channel);
        this.props.setCurrentChannel(channel);
    }

    activeChannel = channel =>{
        this.setState({activeChannel: channel.id})
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
                    {this.displayChannels(channels)}
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

export default connect(null,{setCurrentChannel})(Channels);