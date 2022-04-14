import { styled } from 'linaria/react';
import { css } from 'linaria';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import Dots from '../animations/Dots';
import isTabGuild from '../../utils/isTabGuild';
import GuildsService from '../../services/api/guilds/guilds.service';
import Role from '../../store/models/Role';
import Tab from '../sidebar/Tab';
import $UserStore from '../../store/UserStore';
import { setModalState } from '../../store/ModalStore';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Member from '../sidebar/Member';
import { addUnread } from '../../store/UnreadStore';


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

const Scrollable = styled.div`
  flex-grow: 1;
  overflow-y: scroll;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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

  const navigate = useNavigate();

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
        navigate(`/channels/${guildId}/${newGuildChannels[newGuildChannels.indexOf(guilds[guildId]?.default_channel || '')] || newGuildChannels[0]}`);
      }
    }

    if (!['channels', 'guildsettings'].includes(path)) {
      document.title = 'Nexomia';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId, path]);

  useEffect(() => {
    const newGuildChannels = channels[guildId] || [];
    setGuildChannelsValue(newGuildChannels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels]);

  return (
    <SidebarContainer className={ classNames({ [WideSidebarCss]: path === 'channelsettings' ||path === 'guildsettings' || path === 'settings' }) }>
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
            onClick={ () => { navigate(`/discover/people`) } }
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
            onClick={ () => { navigate(`/home/feed`) } }
          />
          <Tab
            Icon={ RiUserFill }
            title={ t('tabs.friends') }
            tabId={ 'friends' }
            onClick={ () => { navigate(`/home/friends`) } }
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
            onClick={ () => { navigate(`/settings/general`) } }
          />

          <StyledText className={ css`margin: 2px 0px 2px 16px; color: var(--text-secondary); font-weight: 900` }>{ t('tabs.chat') }</StyledText>
          <Tab
            title={ t('tabs.emotes') }
            tabId={ 'emotes' }
            onClick={ () => { navigate(`/settings/emotes`) } }
          />

          <StyledText className={ css`margin: 2px 0px 2px 16px; color: var(--text-secondary); font-weight: 900` }></StyledText>
          <Tab
            negative={ true }
            title={ t('tabs.logout') }
            tabId={ 'logout' }
            onClick={ () => { navigate(`/settings/emotes`) } }
          />

          <StyledText className={ css`margin: 2px 0px 2px 16px; color: var(--text-secondary); font-weight: 900` }>Build 12<br />18.02.2022</StyledText>
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
            onClick={ () => { navigate(`/guildsettings/${guildId}/general`) } }
          />
          <Tab
            title={ t('tabs.roles') }
            tabId={ 'roles' }
            onClick={ () => { navigate(`/guildsettings/${guildId}/roles`) } }
          />
          <Tab
            title={ t('tabs.invites') }
            tabId={ 'invites' }
            onClick={ () => { navigate(`/guildsettings/${guildId}/invites`) } }
          />
          <Tab
            title={ t('tabs.bans') }
            tabId={ 'bans' }
            onClick={ () => { navigate(`/guildsettings/${guildId}/bans`) } }
          />
                    
        </Fragment>
      ) }

      { path === 'channelsettings' && type === 'channels' && (
        <Fragment>
          <SidebarHeader>
            <Content>{ t('tabs.channel_settings') }</Content>
          </SidebarHeader>
          <Tab
            title={ t('tabs.general') }
            tabId={ 'general' }
            onClick={ () => { navigate(`/channelsettings/${guildId}/general`) } }
          />
          <Tab
            title={ t('tabs.permissions') }
            tabId={ 'permissions' }
            onClick={ () => { navigate(`/channelsettings/${guildId}/permissions`) } }
          />
          <Tab
            title={ t('tabs.invites') }
            tabId={ 'invites' }
            onClick={ () => { navigate(`/channelsettings/${guildId}/invites`) } }
          />
          <Tab
            title={ t('tabs.webhooks') }
            tabId={ 'webhooks' }
            onClick={ () => { navigate(`/channelsettings/${guildId}/webhooks`) } }
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
        <Scrollable>
          {
            [
              ...(guildChannels.map((channel: string) => (
                !!(PermissionCalculator.getUserPermissions(guildId, channel, user.id) & ComputedPermissions.VIEW_CHANNEL) && (
                  <Tab
                    Icon={ BiHash }
                    title={ channelsCache[channel]?.name || '' }
                    tabId={ channelsCache[channel]?.id }
                    key={ channelsCache[channel]?.id }
                    onClick={ () => { navigate(`/channels/${guildId}/${channel}`) } }
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
          }
        </Scrollable>
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
        <Scrollable>
          {
            guildChannels.map((channel: string) => (
              <Member
                id={ channelsCache[channel]?.recipients?.filter((id: string) => id !== user.id)[0] || '' }
                tab={ true }
                key={ channel }
                active={ channelId === channel }
                onClick={ () => { navigate(`/channels/@me/${channel}`) } }
              />
            ))
          }
        </Scrollable>
      ) }
    </SidebarContainer>
  );

  async function loadChannels() {
    setLoading(true);
    const response = await GuildsService.getFullGuild(guildId || '');
    const membersResponse = await GuildsService.getGuildMembers(guildId || '');
    if (!response) return navigate('/home');

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
      channels.forEach((ch: Channel) => BigInt(ch.last_message_id) > BigInt(ch.last_read_snowflake) ? addUnread({ guildId: ch.guild_id || '@me', channelId: ch.id, message_id: ch.last_message_id}) : null)
      const defaultChannel = channels[channels.findIndex((channel: Channel) => guild?.default_channel === channel.id)]?.id || channels[0].id;
      if (defaultChannel && !channelId && guildId !== '@me') {
        navigate(`/channels/${guildId}/${defaultChannel}`);
      }
    }

    setLoading(false);
  }
}

export default Sidebar;
