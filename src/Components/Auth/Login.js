import React, { Component } from 'react';
import './app.css';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase'

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    };


    onChangeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }


    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)


    onSubmitHandler = (event) => {
        event.preventDefault();

        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })
            firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then(signedInUser =>{
                console.log(signedInUser)
            })
            .catch(error=>{
                console.log(error);
                this.setState({errors:this.state.errors.concat(error),loading:false});
            })

        }

    };
    isFormValid=({email, password}) => email && password;

    handleSubmitError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    render() {
        const { email, password, errors, loading } = this.state;
        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth: 550 }}>
                    <Header as='h1' icon color='violet' textAlign='center'>
                        <Icon name='code branch' color='violet' />
                        Login to DevChat
                    </Header>
                    <Form size='large' onSubmit={this.onSubmitHandler} >
                        <Segment >
                            <Form.Input fluid name='email' className={this.handleSubmitError(errors, 'email')} icon='mail' iconPosition='left' placeholder='Email Address' onChange={this.onChangeHandler} type='email' value={email} />
                            <Form.Input fluid name='password' className={this.handleSubmitError(errors, 'password')} icon='lock' iconPosition='left' placeholder='Password' onChange={this.onChangeHandler} type='password' value={password} />

                            <Button disabled={loading} className={loading ? 'loading' : ''} color='violet' fluid size='large' >Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message> Dont have an Account? <Link to='/register'> Register Here...</Link></Message>
                </Grid.Column>

            </Grid>
        );
    }
}

export default Login;