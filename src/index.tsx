import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';


import { attachLogger } from 'effector-logger';

import App from './views/App';
import Login from './views/Login';
import Register from './views/Register';
import { ErrorBoundary } from 'react-error-boundary';
import Crash from './views/Crash';

const renderRoot = createRoot(document.getElementById('root')!, {});
renderRoot.render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ Crash }
    >
      <Router>
        <Routes>
          <Route
            path='/app/login'
            element={ <Login /> }
          />
          <Route
            path='/app/register'
            element={ <Register /> }
          />
          <Route
            path='/app/*'
            element={ <App /> }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);

attachLogger();
