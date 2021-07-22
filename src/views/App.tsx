import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom';

import '../i18n/config';

import '../styles/App.css';

import Guilds from '../components/layout/Guilds';
import Sidebar from '../components/layout/Sidebar';
import Content from '../components/layout/Content';

function App() {
  const match = useRouteMatch();

  return (
    <div className="App dark-theme">
      <Guilds />
      <Sidebar />
      <Switch>
        <Route path={`${match.path}/:channelId`}>
          <Content />
          <Sidebar />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

