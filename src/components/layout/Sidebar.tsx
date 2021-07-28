import { styled } from 'linaria/react';
import { css } from 'linaria';
import { Fragment, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useStore } from 'effector-react';
import $GuildStore from '../../store/GuildStore';
import $GuildCacheStore from '../../store/GuildCacheStore';
import $ChannelStore, { setGuildChannels } from '../../store/ChannelStore';
import $ChannelCacheStore, { cacheChannels } from '../../store/ChannelCacheStore';
import Tab from '../sidebar/Tab';

import { BiHash } from 'react-icons/bi';
import {
  RiVolumeDownFill,
  RiMessage3Fill,
  RiUserFill
} from 'react-icons/ri';

import SidebarHeader from './SidebarHeader';

import Channel from '../../store/models/Channel';
import StyledText from '../ui/StyledText';
import CenteredContainer from './CenteredContainer';
import channelsService from '../../services/api/channels/channels.service';
import Dots from '../animations/Dots';
import classNames from 'classnames';
import isTabGuild from '../../utils/isTabGuild';

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
  [key: string]: string[]
}

interface ChannelsCache {
  [key: string]: Channel
}

function Sidebar({ type = 'channels' }: SidebarProps) {
  const { guildId, channelId } = useParams<RouteParams>();

  const guilds = useStore($GuildCacheStore);
  const channels = useStore<GuildChannels>($ChannelStore);
  const channelsCache = useStore<ChannelsCache>($ChannelCacheStore);

  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [guildChannels, setGuildChannelsValue] = useState<string[]>([]);

  useEffect(() => {
    setLoading(false);
    if (type === 'channels') {
      if (!isTabGuild(guildId)) return;
      setGuildChannelsValue(channels[guildId] || []);
      
      if (!guildChannels.length) {
        loadChannels();
      }
    }
  }, [guildId]);

  return (
    <SidebarContainer>
      { guildId === '@me' && type === 'channels' && (
        <SidebarHeader>
          <Content>Direct Messages</Content>
        </SidebarHeader>
      ) }

      { (guildId === '@discover' || guildId === '@profiles') && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>Discover</Content>
          </SidebarHeader>
          <Tab
            Icon={ RiUserFill }
            title={ 'People' }
            tabId={ 'people' }
            active={ guildId === '@profiles' }
            onClick={ () => { history.push(`/channels/@discover/people`) } }
          />
        </Fragment>
      ) }

      { guildId === '@home' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>Home</Content>
          </SidebarHeader>
          <Tab
            Icon={ RiMessage3Fill }
            title={ 'Feed' }
            tabId={ 'feed' }
            onClick={ () => { history.push(`/channels/@home/feed`) } }
          />
          <Tab
            Icon={ RiUserFill }
            title={ 'Friends' }
            tabId={ 'friends' }
            onClick={ () => { history.push(`/channels/@home/friends`) } }
          />
        </Fragment>
      ) }

      { isTabGuild(guildId) && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ guilds[guildId]?.name }</Content>
          </SidebarHeader>
        </Fragment>
      ) }

      { isTabGuild(guildId) && type === 'channels' && (guildChannels.length && channelsCache[guildChannels[0]] ? (
        guildChannels.map((channel: string) => (
          <Tab
            Icon={ BiHash }
            title={ channelsCache[channel]?.name || '' }
            tabId={ channelsCache[channel]?.id }
            key={ channelsCache[channel]?.id }
            onClick={ () => { history.push(`/channels/${guildId}/${channel}`) } }
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
    if (!response) return history.push('/channels/@home');
    cacheChannels(response);
    setGuildChannels({ guild: guildId, channels: response.map((channel: Channel) => channel.id) });
    setGuildChannelsValue(response.map((channel: Channel) => channel.id));
    setLoading(false);
  }
}

export default Sidebar;
