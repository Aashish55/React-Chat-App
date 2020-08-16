import React from "react";
import { Sidebar, Menu, Divider, Button, Modal, Icon } from 'semantic-ui-react';
import {CirclePicker} from 'react-color'

class ColorPanel extends React.Component {
  state = {
    modal: false
  }

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false })

  render() {
    const { modal } = this.state;
    return (
      <Sidebar
        as={Menu}
        icon='labeled'
        inverted
        vertical
        visible
        width='very thin'
      >
        <Divider />
        <Button icon='add' size='small' color='blue' onClick={this.openModal} />

        <Modal basic open={modal} onClose={this.closeModal} >
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <CirclePicker />
          </Modal.Content>
          <Modal.Actions>
            <Button inverted color='green'>
              <Icon name='checkmark' /> Save Colors
            </Button>
            <Button inverted color='red' onClick={this.closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>

      </Sidebar>
    );
  }
}

export default ColorPanel;
