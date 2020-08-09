import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../action'

class Starred extends Component {
    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        activeChannel: '',
        starredChannels: []
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = userId => {
        this.state.usersRef.child(userId).child('starred').on('child_added', snap => {
            const starredChannel = { id: snap.key, ...snap.val() }
            this.setState({ starredChannels: [...this.state.starredChannels, starredChannel] });
        });

        this.state.usersRef.child(userId).child('starred').on('child_removed', snap => {
            const channelToRemove = { id: snap.key, ...snap.val() }
            const filteredChannel = this.state.starredChannels.filter(channel => {
                return channel.id !== channelToRemove.id;
            })
            this.setState({ starredChannels: filteredChannel })
        })
    }


    displayChannels = starredChannels =>
        starredChannels.length > 0 &&
        starredChannels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ));


    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    };

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    };


    render() {

        const { starredChannels } = this.state

        return (
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name="star" /> Starred
            </span>{" "}
            ({starredChannels.length})
          </Menu.Item>
                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        );
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);