import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useParams
} from 'react-router-dom';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from 'effector-react';
import $AuthStore, { setToken } from '../store/AuthStore';
import { setUser } from '../store/UserStore';
import { setGuilds } from '../store/GuildStore';
import { cacheGuilds } from '../store/GuildCacheStore';

import UsersService from '../services/api/users/users.service';
import GuildsService from '../services/api/guilds/guilds.service';
import CommonRequestManager from '../services/api/common';

import '../i18n/config';

import '../styles/App.css';

import Guilds from '../components/layout/Guilds';
import Sidebar from '../components/layout/Sidebar';
import Content from '../components/layout/Content';
import LoadingPlaceholder from '../components/ui/LoadingPlaceholder';
import Modals from '../components/layout/Modals';

import preloaders from '../i18n/preloaders.json';
import Guild from '../store/models/Guild';

function App() {
  const { t } = useTranslation(['states']);

  const { token } = useStore($AuthStore);

  const match = useRouteMatch();
  const history = useHistory();

  const [loaded, setLoaded] = useState(false);

  const [loaderTitleAuthor, setLoaderTitleAuthor] = useState(0);
  const [loaderTitleId, setLoaderTitleId] = useState(0);

  useEffect(() => {
    const authorId = getRandomInt(preloaders.authors.length)
    setLoaderTitleAuthor(authorId);
    setLoaderTitleId(preloaders.authors[authorId].prefix + getRandomInt(preloaders.authors[authorId].count));

    preloadUserInfo();
  }, []);

  return (
    <div className="App dark-theme">
      <LoadingPlaceholder
        title={ t(`states:loading.${loaderTitleId.toString()}`) }
        subtext={ `@${preloaders.authors[loaderTitleAuthor].name}` }
        active={ !loaded }
        solid={ true }
      />
      <Switch>
        <Route path={`/channels/:guildId/:channelId`}>
          <Modals />
          <Guilds />
          <Sidebar />
          <Content />
          <Sidebar type="members" />
        </Route>

        <Route path={`/channels/:guildId`}>
          <Modals />
          <Guilds />
          <Sidebar />
          <Content />
          <Sidebar type="members" />
        </Route>

        <Route path={`/:path/:guildId`}>
          <Modals />
          <Guilds />
          <Sidebar />
          <Content />
        </Route>

        <Route path={`/:path`}>
          <Modals />
          <Guilds />
          <Sidebar />
          <Content />
        </Route>
      </Switch>
    </div>
  );

  async function preloadUserInfo() {
    CommonRequestManager.setToken(token);
    const userInfo = await UsersService.getUser('@me');
    if (!userInfo) {
      setToken('');
      history.push('/login');
      return;
    }

    const guilds = await GuildsService.getUserGuilds();

    setUser(userInfo);
    setGuilds(guilds.map((guild: Guild) => guild.id));
    cacheGuilds(guilds);

    setLoaded(true);
  }
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

export default App;

