import React, { Component } from 'react';
import './app.css';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase'

class Register extends Component {
    state = {
        username:'',
        email:'',
        password:'',
        passwordConfirmation:''
    }


    onChangeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value})
    }


    onSubmitHandler = (event) => {
        event.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(createdUser =>{
            console.log(createdUser);
        })
        .catch(error=>{
            console.log(error)
        })
            
    }
    render() {
        const {username, email, password, passwordConfirmation} = this.state;
        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth: 550 }}>
                    <Header as='h2' icon color='orange' textAlign='center'>
                        <Icon name='puzzle piece' color='orange' />
                        Register For DevChat
                    </Header>
                    <Form size='large' onSubmit={this.onSubmitHandler} >
                        <Segment >
                            <Form.Input fluid name='username' icon='user' iconPosition='left' placeholder='Username' onChange={this.onChangeHandler} type='text' value={username} />
                            <Form.Input fluid name='email' icon='mail' iconPosition='left' placeholder='Email Address' onChange={this.onChangeHandler} type='email' value={email}/>
                            <Form.Input fluid name='password' icon='lock' iconPosition='left' placeholder='Password' onChange={this.onChangeHandler} type='password' value={password} />
                            <Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition='left' placeholder='Password Confirm' onChange={this.onChangeHandler} type='password' value={passwordConfirmation} />

                            <Button color='orange' fluid size='large' >Submit</Button>
                        </Segment>
                    </Form>
                    <Message> Already a User? <Link to='/Login'>Login</Link></Message>
                </Grid.Column>

            </Grid>
        );
    }
}

export default Register;