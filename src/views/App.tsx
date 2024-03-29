import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';

import { useState, useEffect } from 'react';

import { useStore } from 'effector-react';
import $AuthStore, { setToken } from '../store/AuthStore';
import $UserStore, { setUser } from '../store/UserStore';
import { setGuilds } from '../store/GuildStore';
import { cacheGuilds } from '../store/GuildCacheStore';
import $ContextMenuStore, { setContextMenu } from '../store/ContextMenuStore';

import UsersService from '../services/api/users/users.service';
import GuildsService from '../services/api/guilds/guilds.service';
import ChannelsService from '../services/api/channels/channels.service';
import CommonRequestManager from '../services/api/common';

import SocketManager from '../services/socket/SocketManager';

import '../i18n/config';

import '../styles/App.css';

import Guilds from '../components/layout/Guilds';
import Sidebar from '../components/layout/Sidebar';
import MemberSidebar from '../components/layout/MemberSidebar';
import Content from '../components/layout/Content';
import BrandLoading from '../components/ui/BrandLoading';
import Modals from '../components/layout/Modals';

import Guild from '../store/models/Guild';
import ContextMenu from '../components/contextmenus/ContextMenu';
import Channel from '../store/models/Channel';
import EmojiPack from '../store/models/EmojiPack';
import { cacheChannels } from '../store/ChannelCacheStore';
import { setGuildChannels } from '../store/ChannelStore';
import { cacheUsers } from '../store/UserCacheStore';
import { cacheEmojiPacks } from '../store/EmojiPackStore';

function App() {
  const { token } = useStore($AuthStore);
  const User = useStore($UserStore);

  const history = useHistory();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    preloadUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App dark-theme" onClick={ closeContextMenu } onContextMenu={ (event: any) => event.preventDefault() }>
      <BrandLoading
        active={ !loaded }
        solid={ true }
      />
      { loaded && (
        <Switch>
          <Route path={`/channels/:guildId/:channelId`}>
            <ContextMenu />
            <Modals />
            <Guilds />
            <Sidebar />
            <Content />
            <MemberSidebar />
          </Route>

          <Route path={`/channels/:guildId`}>
            <ContextMenu />
            <Modals />
            <Guilds />
            <Sidebar />
            <Content />
          </Route>

          <Route path={`/:path/:guildId/:channelId`}>
            <ContextMenu />
            <Modals />
            <Guilds />
            <Sidebar />
            <Content />
          </Route>

          <Route path={`/:path/:guildId`}>
            <ContextMenu />
            <Modals />
            <Guilds />
            <Sidebar />
            <Content />
          </Route>

          <Route path={`/:path`}>
            <ContextMenu />
            <Modals />
            <Guilds />
            <Sidebar />
            <Content />
          </Route>

          { User ? (
            <Route path='/'>
              { () => history.push('/home') }
            </Route>
          ) : null }
        </Switch>
      ) }
    </div>
  );

  async function preloadUserInfo() {
    CommonRequestManager.setToken(token);
    const receivedUserInfo = await UsersService.getUser('@me');
    if (!receivedUserInfo) {
      setToken('');
      history.push('/login');
      return;
    }

    const { emoji_packs, ...userInfo } = receivedUserInfo;

    userInfo.emojiPacks = emoji_packs.map((pack: EmojiPack) => pack.id);
    
    cacheEmojiPacks(emoji_packs);

    cacheUsers([userInfo]);

    const guilds = await GuildsService.getUserGuilds();
    const dmChannels = await ChannelsService.getDMChannels();

    setUser(userInfo);
    setGuilds(guilds.map((guild: Guild) => guild.id));
    cacheGuilds(guilds);

    cacheChannels(dmChannels);
    setGuildChannels({ guild: '@me', channels: dmChannels.map((channel: Channel) => channel.id) });

    SocketManager.setToken(localStorage.getItem('authid') || ''); // need fix later
    SocketManager.init(setLoaded);

    SocketManager.onLoad = () => setLoaded(true);
  }

  function closeContextMenu() {
    const menuState = $ContextMenuStore.getState();
    if (menuState.lock || !menuState.visible) return;
    setContextMenu({ visible: false });
  }
}

export default App;

