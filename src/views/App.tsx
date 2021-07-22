import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom';

import './App.css';

import Servers from '../components/Servers';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';

function App() {
  const match = useRouteMatch();

  return (
    <div className="App">
      <Servers />
      <Switch>
        <Route path={`${match.path}/:channelId`}>
          <Sidebar />
        </Route>
      </Switch>
      <Content />
    </div>
  );
}

export default App;
