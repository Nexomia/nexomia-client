import { useStore } from 'effector-react';
import { styled } from 'linaria/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import $GuildCacheStore from '../../store/GuildCacheStore';
import EmotesUserView from './app/EmotesUserView';
import GeneralUserView from './app/GeneralUserView';
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
  channelId: string
}

function SettingsView() {
  const { guildId, channelId } = useParams<RouteParams>();

  const Guilds = useStore($GuildCacheStore);

  useEffect(() => {
    document.title = `${Guilds[guildId]?.name} settings - Nexomia`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      { channelId === 'general' && (
        <GeneralView />
      ) }

      { channelId === 'roles' && (
        <RolesView />
      ) }

      { channelId === 'invites' && (
        <InvitesView />
      ) }

      { channelId === 'bans' && (
        <BansView />
      ) }
    </Wrapper>
  ) 
}

export default SettingsView;
