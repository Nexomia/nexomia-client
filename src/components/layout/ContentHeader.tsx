import { styled } from 'linaria/react';
import { css } from 'linaria';
import { Fragment } from 'react';

import { useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import { BiHash } from 'react-icons/bi';
import {
  RiPushpinFill,
  RiSearchLine,
  RiUserFill
} from 'react-icons/ri';
import classNames from 'classnames';
import StyledIconCss from '../css/StyledIconCss';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $UserCacheStore from '../../store/UserCacheStore';
import isTabGuild from '../../utils/isTabGuild';
import InputButton from '../chat/InputButton';
import { useTranslation } from 'react-i18next';

const Header = styled.div`
  height: 48px;
  display: flex;
  alignSelf: stretch;
  align-items: center;
  flex-shrink: 0;
`

const Content = styled.div`
  display: flex;
  align-self: center;
  color: var(--text-primary);
  font-weight: 900;
  font-size: 18px;
  padding: 0 8px;
  user-select: none;
`

const HeaderIconCss = css`
  width: 28px;
  height: 28px;
  margin-left: 8px;
`

const InputIconCss = css`
  width: 24px;
  height: 24px;
`

interface RouteParams {
  path: string,
  guildId: string,
  channelId: string
}

function ContentHeader() {
  const { path, guildId, channelId } = useParams<RouteParams>();
  const channelsCache = useStore($ChannelCacheStore);
  const usersCache = useStore($UserCacheStore);
  const { t } = useTranslation(['settings']);

  return (
    <Header>
      { path === 'profiles' && guildId !== 'people' && (
        <RiUserFill className={ classNames({ [StyledIconCss]: true, [HeaderIconCss]: true }) } />
      ) }

      { !path && isTabGuild(guildId) && channelId && (
        channelsCache[channelId]?.name && (<BiHash className={ classNames({ [StyledIconCss]: true, [HeaderIconCss]: true }) } />)
      ) }

      { !path && isTabGuild(guildId) && channelId && (
        <Fragment>
          <Content>{ channelsCache[channelId]?.name || '' }</Content>
          <div className={ css`flex-grow: 1` } />
          <InputButton>
            <RiPushpinFill className={ classNames(StyledIconCss, InputIconCss) } />
          </InputButton>
        </Fragment>
      ) }

      { path === 'profiles' && guildId !== 'people' && (
        <Content>{ t('tabs.profile_header').replace('%username%', usersCache[guildId]?.username || '') }</Content>
      ) }

      { path === 'guildsettings' && channelId === 'general' && (
        <Content>{ t('tabs.general') }</Content>
      ) }

      { path === 'guildsettings' && channelId === 'roles' && (
        <Content>{ t('tabs.roles') }</Content>
      ) }
    </Header>
  );
}

export default ContentHeader;