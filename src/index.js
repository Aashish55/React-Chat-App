import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import registerServiceWorker from './registerServiceWorker';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const Root =() => (
    <Router>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
        </Switch>
    </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
