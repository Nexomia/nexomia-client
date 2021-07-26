import { styled } from 'linaria/react';
import { css } from 'linaria';
import { Fragment, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useStore } from 'effector-react';
import $GuildStore from '../../store/GuildStore';
import $GuildCacheStore from '../../store/GuildCacheStore';
import { $ChannelStore, $CurrentChannelStore, setGuildChannels, setCurrentChannel } from '../../store/ChannelStore';
import Tab from '../sidebar/Tab';

import { BiHash } from 'react-icons/bi';
import { RiVolumeDownFill } from 'react-icons/ri';

import SidebarHeader from './SidebarHeader';

import Channel from '../../store/models/Channel';
import StyledText from '../ui/StyledText';
import CenteredContainer from './CenteredContainer';
import channelsService from '../../services/api/channels/channels.service';
import Dots from '../animations/Dots';
import classNames from 'classnames';

const SidebarContainer = styled.div`
  display: flex;
  width: 240px;
  flex-direction: column;
  align-self: stretch;
  background: var(--background-secondary-alt)
`

const Content = styled.div`
  display: flex;
  align-self: center;
  color: var(--text-primary);
  font-weight: 900;
  font-size: 18px;
  padding: 0 16px;
  user-select: none;
`

interface RouteParams {
  guildId: string,
  channelId: string
}

interface SidebarProps {
  type?: string
}

interface GuildChannels {
  [key: string]: Channel[]
}

function Sidebar({ type = 'channels' }: SidebarProps) {
  const { guildId, channelId } = useParams<RouteParams>();

  const guilds = useStore($GuildCacheStore);
  const channels = useStore<GuildChannels>($ChannelStore);
  const currentChannel = useStore<Channel>($CurrentChannelStore);

  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [guildChannels, setGuildChannelsValue] = useState<Channel[]>([]);

  useEffect(() => {
    setLoading(false);
    if (type === 'channels') {
      if (guildId === '@me' || guildId === '@home') return;
      setGuildChannelsValue(channels[guildId] || []);
      
      if (!guildChannels.length) {
        loadChannels();
      }
    }
  }, [guildId]);

  useEffect(() => {
    if (type !== 'channels') return;
    if (!channelId) {
      setCurrentChannel({ guild: '', channel: '' });
      return;
    }
    setCurrentChannel({ guild: guildId, channel: channelId });
  }, [channelId]);

  return (
    <SidebarContainer>
      { guildId === '@me' && type === 'channels' && (
        <SidebarHeader>
          <Content>Direct Messages</Content>
        </SidebarHeader>
      ) }

      { guildId === '@home' && type === 'channels' && (
        <SidebarHeader>
          <Content>Home</Content>
        </SidebarHeader>
      ) }

      { guildId !== '@me' && guildId !== '@home' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ guilds[guildId].name }</Content>
          </SidebarHeader>
        </Fragment>
      ) }

      { guildId !== '@me' && guildId !== '@home' && type === 'channels' && (guildChannels.length ? (
        guildChannels.map((channel: Channel) => (
          <Tab
            Icon={ BiHash }
            title={ channel.name || '' }
            tabId={ channel.id }
            key={ channel.id }
            onClick={ () => { history.push(`/channels/${guildId}/${channel.id}`) } }
          />
        ))
      ) : loading ? (
        <CenteredContainer>
          <Dots />
        </CenteredContainer>
      ) : (
        <StyledText className={ css`text-align: center` }>No channels</StyledText>
      )) }
    </SidebarContainer>
  );

  async function loadChannels() {
    setLoading(true);
    const response = await channelsService.getGuildChannels(guildId);
    setGuildChannels({ guild: guildId, channels: response });
    setGuildChannelsValue(response);
    setLoading(false);
  }
}

export default Sidebar;
