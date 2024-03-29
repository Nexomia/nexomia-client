import { styled } from 'linaria/react';
import { css } from 'linaria';
import { Fragment, useEffect, useState } from 'react';

import { useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import { BiHash } from 'react-icons/bi';
import {
  RiPushpinFill,
  RiUserFill
} from 'react-icons/ri';
import classNames from 'classnames';
import StyledIconCss from '../css/StyledIconCss';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $UserCacheStore from '../../store/UserCacheStore';
import isTabGuild from '../../utils/isTabGuild';
import InputButton from '../chat/InputButton';
import { useTranslation } from 'react-i18next';
import PinnedMessagesView from '../chat/PinnedMessagesView';

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
  margin-left: 7px;
  @-moz-document url-prefix() {
    margin-top: -2px;
  }
`

const HeaderIconCss = css`
  width: 28px;
  height: 28px;
  margin-left: 14px;
  margin-right: -7px;
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

  const [pinsOpened, setPinsOpened] = useState(false);

  useEffect(() => setPinsOpened(false), [channelId]);

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
          <InputButton onClick={ () => setPinsOpened(!pinsOpened) }>
            <RiPushpinFill className={ classNames(StyledIconCss, InputIconCss) } />
          </InputButton>
          { pinsOpened && <PinnedMessagesView channel={ channelId } /> }
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

      { path === 'guildsettings' && channelId === 'invites' && (
        <Content>{ t('tabs.invites') }</Content>
      ) }

      { path === 'settings' && guildId === 'general' && (
        <Content>{ t('tabs.profile') }</Content>
      ) }

      { path === 'settings' && guildId === 'emotes' && (
        <Content>{ t('tabs.emotes') }</Content>
      ) }
    </Header>
  );
}

export default ContentHeader;