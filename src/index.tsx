import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import './index.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store/store';

import App from './views/App';
import Login from './views/Login';
import Register from './views/Register';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
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
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
