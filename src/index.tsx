import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { attachLogger } from 'effector-logger/attach';
import { root } from 'effector-root';

import App from './views/App';
import Login from './views/Login';
import Register from './views/Register';

const renderRoot = createRoot(document.getElementById('root')!);
renderRoot.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route
          path='/login'
          element={ <Login /> }
        />
        <Route
          path='/register'
          element={ <Register /> }
        />
        <Route
          path='/*'
          element={ <App /> }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);

attachLogger(root);
