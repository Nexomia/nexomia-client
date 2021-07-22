import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import './index.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import App from './views/App';
import Login from './views/Login';
import Register from './views/Register';

ReactDOM.render(
  <React.StrictMode>
    <IntlProvider locale='en' defaultLocale='en'>
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
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
