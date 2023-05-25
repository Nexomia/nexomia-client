import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import $GuildCacheStore from '../../store/GuildCacheStore';
import EmotesUserView from './app/EmotesUserView';
import GeneralUserView from './app/GeneralUserView';
import ChannelGeneralView from './channel/ChannelGeneralView';
import ChannelInvitesView from './channel/ChannelInvitesView';
import ChannelPermissionsView from './channel/ChannelPermissionsView';
import BansView from './guild/BansView';
import GeneralView from './guild/GeneralView';
import InvitesView from './guild/InvitesView';
import RolesView from './guild/RolesView';

const Wrapper = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 16px;
`

interface RouteParams {
  guildId: string,
  channelId: string,
  path: string
}

function SettingsView() {
  const { guildId, channelId, path } = useParams<RouteParams>();

  const Guilds = useStore($GuildCacheStore);

  useEffect(() => {
    document.title = `${Guilds[guildId]?.name} settings - Nexomia`;
    
  }, [])

  return (
    <Wrapper>
      { /* App */ }
      { guildId === 'general' && (
        <GeneralUserView />
      ) }

      { guildId === 'emotes' && (
        <EmotesUserView />
      ) }

      { /* Guild */ }
      { path === 'guildsettings' && channelId === 'general' && (
        <GeneralView />
      ) }

      { path === 'guildsettings' && channelId === 'roles' && (
        <RolesView />
      ) }

      { path === 'guildsettings' && channelId === 'invites' && (
        <InvitesView />
      ) }

      { path === 'guildsettings' && channelId === 'bans' && (
        <BansView />
      ) }

      { /* Channel */ }
      { path === 'channelsettings' && channelId === 'general' && (
        <ChannelGeneralView />
      ) }

      { path === 'channelsettings' && channelId === 'permissions' && (
        <ChannelPermissionsView />
      ) }

      { path === 'channelsettings' && channelId === 'invites' && (
        <ChannelInvitesView />
      ) }

      { path === 'channelsettings' && channelId === 'bans' && (
        <BansView />
      ) }
    </Wrapper>
  ) 
}

export default SettingsView;
