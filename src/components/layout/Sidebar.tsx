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
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Member from '../sidebar/Member';


const SidebarContainer = styled.div`
  display: flex;
  width: 240px;
  flex-shrink: 0;
  flex-direction: column;
  align-self: stretch;
  background: var(--background-secondary-alt);
`

const WideSidebarCss = css`
  width: calc(50vw - 298px);
  padding-left: calc(50vw - 538px);
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

  const { t } = useTranslation(['settings', 'chat']);

  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [guildChannels, setGuildChannelsValue] = useState<string[]>([]);

  useEffect(() => {
    setLoading(false);
    if (type === 'channels') {
      const newGuildChannels = channels[guildId] || [];
      setGuildChannelsValue(newGuildChannels);
      
      if (!newGuildChannels.length && (!path || path === 'guildsettings') && isTabGuild(guildId)) {
        loadChannels();
      } else if (!path && !channelId && guildId !== '@me') {
        history.push(`/channels/${guildId}/${newGuildChannels[newGuildChannels.indexOf(guilds[guildId]?.default_channel || '')] || newGuildChannels[0]}`);
      }
    }

    if (!['channels', 'guildsettings'].includes(path)) {
      document.title = 'Nexomia';
    }
  }, [guildId, path]);

  useEffect(() => {
    const newGuildChannels = channels[guildId] || [];
    setGuildChannelsValue(newGuildChannels);
  }, [channels]);

  return (
    <SidebarContainer className={ classNames({ [WideSidebarCss]: path === 'guildsettings' || path === 'settings' }) }>
      { !path && guildId === '@me' && type === 'channels' && (
        <SidebarHeader>
          <Content>{ t('tabs.direct_messages') }</Content>
        </SidebarHeader>
      ) }

      { (path === 'discover' || path === 'profiles') && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ t('tabs.discover') }</Content>
          </SidebarHeader>
          <Tab
            Icon={ RiUserFill }
            title={ t('tabs.people') }
            tabId={ 'people' }
            active={ path === 'profiles' }
            onClick={ () => { history.push(`/discover/people`) } }
          />
        </Fragment>
      ) }

      { path === 'home' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ t('tabs.home') }</Content>
          </SidebarHeader>
          <Tab
            Icon={ RiMessage3Fill }
            title={ t('tabs.feed') }
            tabId={ 'feed' }
            onClick={ () => { history.push(`/home/feed`) } }
          />
          <Tab
            Icon={ RiUserFill }
            title={ t('tabs.friends') }
            tabId={ 'friends' }
            onClick={ () => { history.push(`/home/friends`) } }
          />
        </Fragment>
      ) }

      { path === 'settings' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ t('tabs.app_settings') }</Content>
          </SidebarHeader>
          <StyledText className={ css`margin: 2px 0px 2px 16px; color: var(--text-secondary); font-weight: 900` }>{ t('tabs.user_divider') }</StyledText>
          <Tab
            title={ t('tabs.profile') }
            tabId={ 'general' }
            onClick={ () => { history.push(`/settings/general`) } }
          />

          <StyledText className={ css`margin: 2px 0px 2px 16px; color: var(--text-secondary); font-weight: 900` }>{ t('tabs.chat') }</StyledText>
          <Tab
            title={ t('tabs.emotes') }
            tabId={ 'emotes' }
            onClick={ () => { history.push(`/settings/emotes`) } }
          />

          <StyledText className={ css`margin: 2px 0px 2px 16px; color: var(--text-secondary); font-weight: 900` }>Client build date: 14.11.2021</StyledText>
        </Fragment>
      ) }

      { path === 'guildsettings' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ t('tabs.server_settings') }</Content>
          </SidebarHeader>
          <Tab
            title={ t('tabs.general') }
            tabId={ 'general' }
            onClick={ () => { history.push(`/guildsettings/${guildId}/general`) } }
          />
          <Tab
            title={ t('tabs.roles') }
            tabId={ 'roles' }
            onClick={ () => { history.push(`/guildsettings/${guildId}/roles`) } }
          />
          <Tab
            title={ t('tabs.invites') }
            tabId={ 'invites' }
            onClick={ () => { history.push(`/guildsettings/${guildId}/invites`) } }
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

      { /* Guild Channels */ }
      { !path && isTabGuild(guildId) && type === 'channels' && (guildChannels && guildChannels.length && channelsCache[guildChannels[0]] ? (
        [
          ...(guildChannels.map((channel: string) => (
            !!(PermissionCalculator.getUserPermissions(guildId, channel, user.id) & ComputedPermissions.VIEW_CHANNEL) && (
              <Tab
                Icon={ BiHash }
                title={ channelsCache[channel]?.name || '' }
                tabId={ channelsCache[channel]?.id }
                key={ channelsCache[channel]?.id }
                onClick={ () => { history.push(`/channels/${guildId}/${channel}`) } }
                contextEnabled
              />
            )
          ))),
          (
            (PermissionCalculator.getUserPermissions(guildId, '', user.id) & ComputedPermissions.MANAGE_CHANNELS) ?
            <Tab
              Icon={ RiAddFill }
              title={ t('chat:channel_new') }
              tabId={ 'new' }
              key={ 'new' }
              onClick={ () => { setModalState({ channelCreation: true }) } }
            /> : null
          )
        ]
      ) : loading ? (
        <CenteredContainer>
          <Dots />
        </CenteredContainer>
      ) : (
        <Fragment>
          <StyledText className={ css`text-align: center; margin-bottom: 16px` }>No channels</StyledText>
          {
            (PermissionCalculator.getUserPermissions(guildId, '', user.id) & ComputedPermissions.MANAGE_CHANNELS) ?
            <Tab
              Icon={ RiAddFill }
              title={ t('chat:channel_new') }
              tabId={ 'new' }
              onClick={ () => { setModalState({ channelCreation: true }) } }
            /> : null
          }
        </Fragment>
      )) }

      { /* DM Channels */ }
      { !path && guildId === '@me' && type === 'channels' && (
        guildChannels.map((channel: string) => (
          <Member
            id={ channelsCache[channel]?.recipients?.filter((id: string) => id !== user.id)[0] || '' }
            tab={ true }
            key={ channel }
            active={ channelId === channel }
            onClick={ () => { history.push(`/channels/@me/${channel}`) } }
          />
        ))
      ) }
    </SidebarContainer>
  );

  async function loadChannels() {
    setLoading(true);
    const response = await GuildsService.getFullGuild(guildId || '');
    const membersResponse = await GuildsService.getGuildMembers(guildId || '');
    if (!response) return history.push('/home');

    const { channels, members, roles, ...guild } = response;

    cacheGuilds([guild]);
    cacheUsers([...membersResponse].map((member: any) => member.user));
    setGuildMembers({ guild: guildId, members: [...membersResponse].map((member: any) => member.id) });
    cacheMembers([...membersResponse].map((member: any) => {
      delete member.user;
      return { ...member, guild: guildId };
    }));
    cacheRoles(roles);
    setGuildRoles({ guild: guildId, roles: roles.sort((a: Role, b: Role) => (a.position || 0) - (b.position || 0)).map((role: Role) => role.id) });
    cacheChannels(channels);
    setGuildChannels({ guild: guildId, channels: channels.map((channel: Channel) => channel.id) });
    setGuildChannelsValue(channels.map((channel: Channel) => channel.id));

    if (channels.length) {
      const defaultChannel = channels[channels.findIndex((channel: Channel) => guild?.default_channel === channel.id)]?.id || channels[0].id;
      if (defaultChannel && !channelId && guildId !== '@me') {
        history.push(`/channels/${guildId}/${defaultChannel}`);
      }
    }

    setLoading(false);
  }
}

export default Sidebar;
