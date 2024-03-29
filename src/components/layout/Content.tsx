import { styled } from 'linaria/react';
import { css } from 'linaria';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import ContentHeader from './ContentHeader';
import ChatView from '../chat/ChatView';
import ProfileView from '../profile/ProfileView';
import SettingsView from '../settings/SettingsView';
import { useStore } from 'effector-react';
import $ChannelStore from '../../store/ChannelStore';

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  alignSelf: stretch;
  background: var(--background-secondary-alt);
`

const ContentBody = styled.div`
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  flex-direction: column;
  justify-content: stretch;
  border-radius: 8px 8px 0 0;
  background: var(--background-primary);
  overflow: hidden;
  overflow-y: auto;
`

const NoSidebarCss = css`
  border-top-right-radius: 0;
`

interface RouteParams {
  path: string,
  guildId: string,
  channelId: string
}

function Content() {
  const { path, guildId, channelId } = useParams<RouteParams>();
  const Channels = useStore($ChannelStore);

  return (
    <Container>
      <ContentHeader />
      <ContentBody className={ classNames({ [NoSidebarCss]: !!path }) }>
        { path === 'profiles' && guildId && (
          <ProfileView user={ guildId } />
        ) }

        { path === 'guildsettings' && guildId && (
          Channels[guildId] ? (
            <SettingsView />
          ) : null
        ) }

        { path === 'settings' && (
          <SettingsView />
        ) }

      { path === 'channelsettings' && (
          <SettingsView />
        ) }

        { !path && channelId && (
          Channels[guildId] ? (
            <ChatView />
          ) : null
        ) }
      </ContentBody>
    </Container>
  );
}

export default Content;