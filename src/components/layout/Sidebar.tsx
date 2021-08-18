import { styled } from 'linaria/react';
import { css } from 'linaria';
import { Fragment, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useStore } from 'effector-react';
import $GuildCacheStore, { setGuildRoles, setGuildMembers, cacheGuilds } from '../../store/GuildCacheStore';
import $ChannelStore, { setGuildChannels } from '../../store/ChannelStore';
import $ChannelCacheStore, { cacheChannels } from '../../store/ChannelCacheStore';
import { cacheUsers } from '../../store/UserCacheStore';
import { cacheMembers } from '../../store/MemberCacheStore';
import { cacheRoles } from '../../store/RolesCacheStore';
import PermissionCalculator from '../../utils/PermissionCalculator';
import { ComputedPermissions } from '../../store/models/ComputedPermissions';

import { BiHash } from 'react-icons/bi';
import {
  RiAddFill,
  RiMessage3Fill,
  RiUserFill
} from 'react-icons/ri';

import SidebarHeader from './SidebarHeader';

import Channel from '../../store/models/Channel';
import StyledText from '../ui/StyledText';
import CenteredContainer from './CenteredContainer';
import ChannelsService from '../../services/api/channels/channels.service';
import Dots from '../animations/Dots';
import isTabGuild from '../../utils/isTabGuild';
import GuildsService from '../../services/api/guilds/guilds.service';
import RolesService from '../../services/api/roles/roles.service';
import Role from '../../store/models/Role';
import Tab from '../sidebar/Tab';
import $UserStore from '../../store/UserStore';
import { setModalState } from '../../store/ModalStore';


const SidebarContainer = styled.div`
  display: flex;
  width: 240px;
  flex-shrink: 0;
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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

interface RouteParams {
  path: string,
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
  const { path, guildId, channelId } = useParams<RouteParams>();

  const guilds = useStore($GuildCacheStore);
  const channels = useStore<GuildChannels>($ChannelStore);
  const channelsCache = useStore<ChannelsCache>($ChannelCacheStore);
  const user = useStore($UserStore);

  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [guildChannels, setGuildChannelsValue] = useState<string[]>([]);

  useEffect(() => {
    setLoading(false);
    if (type === 'channels') {
      if (!isTabGuild(guildId)) return;
      const newGuildChannels = channels[guildId] || [];
      setGuildChannelsValue(newGuildChannels);
      
      if (!newGuildChannels.length && (!path || path === 'guildsettings')) {
        loadChannels();
      }
    }
  }, [guildId]);

  useEffect(() => {
    const newGuildChannels = channels[guildId] || [];
    setGuildChannelsValue(newGuildChannels);
  }, [channels]);

  return (
    <SidebarContainer>
      { !path && guildId === '@me' && type === 'channels' && (
        <SidebarHeader>
          <Content>Direct Messages</Content>
        </SidebarHeader>
      ) }

      { (path === 'discover' || path === 'profiles') && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>Discover</Content>
          </SidebarHeader>
          <Tab
            Icon={ RiUserFill }
            title={ 'People' }
            tabId={ 'people' }
            active={ path === 'profiles' }
            onClick={ () => { history.push(`/discover/people`) } }
          />
        </Fragment>
      ) }

      { path === 'home' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>Home</Content>
          </SidebarHeader>
          <Tab
            Icon={ RiMessage3Fill }
            title={ 'Feed' }
            tabId={ 'feed' }
            onClick={ () => { history.push(`/home/feed`) } }
          />
          <Tab
            Icon={ RiUserFill }
            title={ 'Friends' }
            tabId={ 'friends' }
            onClick={ () => { history.push(`/home/friends`) } }
          />
        </Fragment>
      ) }

      { path === 'guildsettings' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>Server Settings</Content>
          </SidebarHeader>
          <Tab
            title={ 'General' }
            tabId={ 'general' }
            onClick={ () => { history.push(`/guildsettings/${guildId}/general`) } }
          />
          <Tab
            title={ 'Roles' }
            tabId={ 'roles' }
            onClick={ () => { history.push(`/guildsettings/${guildId}/roles`) } }
          />
        </Fragment>
      ) }

      { !path && isTabGuild(guildId) && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ guilds[guildId]?.name }</Content>
          </SidebarHeader>
        </Fragment>
      ) }

      { !path && isTabGuild(guildId) && type === 'channels' && (guildChannels && guildChannels.length && channelsCache[guildChannels[0]] ? (
        [
          ...(guildChannels.map((channel: string) => (
            (PermissionCalculator.getUserPermissions(guildId, channel, user.id) & ComputedPermissions.VIEW_CHANNEL) && (
              <Tab
                Icon={ BiHash }
                title={ channelsCache[channel]?.name || '' }
                tabId={ channelsCache[channel]?.id }
                key={ channelsCache[channel]?.id }
                onClick={ () => { history.push(`/channels/${guildId}/${channel}`) } }
              />
            )
          ))),
          (
            (PermissionCalculator.getUserPermissions(guildId, '', user.id) & ComputedPermissions.MANAGE_CHANNELS) &&
            <Tab
              Icon={ RiAddFill }
              title={ 'New Channel' }
              tabId={ 'new' }
              onClick={ () => { setModalState({ channelCreation: true }) } }
            />
          )
        ]
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
    const response = await ChannelsService.getGuildChannels(guildId);
    if (!response) return history.push('/home');
    const guildResponse = await GuildsService.getFullGuild(guildId || '');
    const membersResponse = await GuildsService.getGuildMembers(guildId || '');
    const rolesResponse = await RolesService.getGuildRoles(guildId || '');

    cacheGuilds([guildResponse]);
    cacheUsers([...membersResponse].map((member: any) => member.user));
    setGuildMembers({ guild: guildId, members: [...membersResponse].map((member: any) => member.id) });
    cacheMembers([...membersResponse].map((member: any) => {
      delete member.user;
      return { ...member, guild: guildId };
    }));
    cacheRoles(rolesResponse);
    setGuildRoles({ guild: guildId, roles: rolesResponse.sort((a: Role, b: Role) => (a.position || 0) - (b.position || 0)).map((role: Role) => role.id) });
    cacheChannels(response);
    setGuildChannels({ guild: guildId, channels: response.map((channel: Channel) => channel.id) });
    setGuildChannelsValue(response.map((channel: Channel) => channel.id));
    setLoading(false);
  }
}

export default Sidebar;
