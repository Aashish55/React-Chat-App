import React, { Component } from 'react';
import './app.css';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase'
import md5 from 'md5';

class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };


    onChangeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    isFormValid() {

        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {

            return false;
        } else {
            return true;
        }
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {

        let errors = [];
        let error;

        if (password.length < 6 || passwordConfirmation.length < 6) {
            error = { message: 'Password must be 6 character long' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (password !== passwordConfirmation) {
            error = { message: 'Password did not match' };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)


    onSubmitHandler = (event) => {
        event.preventDefault();

        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true })

            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                    .then(() => {
                        this.saveUser(createdUser).then(() => {
                            console.log('user saved')
                        })
                    })
                    .catch(error => {
                        console.log(error)
                        this.setState({ errors: this.state.errors.concat(error), loading: false })
                    })

            })
                .catch(error => {
                    console.log(error)
                    this.setState({ errors: this.state.errors.concat(error), loading: false })
                })
        }

    };

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name:createdUser.user.displayName,
            avatar:createdUser.user.photoURL
        })
    }

    handleSubmitError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state;
        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth: 550 }}>
                    <Header as='h1' icon color='orange' textAlign='center'>
                        <Icon name='puzzle piece' color='orange' />
                        Register For DevChat
                    </Header>
                    <Form size='large' onSubmit={this.onSubmitHandler} >
                        <Segment >
                            <Form.Input fluid name='username' className={this.handleSubmitError(errors, 'username')} icon='user' iconPosition='left' placeholder='Username' onChange={this.onChangeHandler} type='text' value={username} />
                            <Form.Input fluid name='email' className={this.handleSubmitError(errors, 'email')} icon='mail' iconPosition='left' placeholder='Email Address' onChange={this.onChangeHandler} type='email' value={email} />
                            <Form.Input fluid name='password' className={this.handleSubmitError(errors, 'password')} icon='lock' iconPosition='left' placeholder='Password' onChange={this.onChangeHandler} type='password' value={password} />
                            <Form.Input fluid name='passwordConfirmation' className={this.handleSubmitError(errors, 'password')} icon='repeat' iconPosition='left' placeholder='Password Confirm' onChange={this.onChangeHandler} type='password' value={passwordConfirmation} />

                            <Button disabled={loading} className={loading ? 'loading' : ''} color='orange' fluid size='large' >Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message> Already a User? <Link to='/Login'>Login Here...</Link></Message>
                </Grid.Column>

            </Grid>
        );
    }
}

export default Register;