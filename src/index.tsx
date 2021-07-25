import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Provider } from 'react-redux';

import App from './views/App';
import Login from './views/Login';
import Register from './views/Register';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path='/channels'>
          <App />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/register'>
          <Register />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
