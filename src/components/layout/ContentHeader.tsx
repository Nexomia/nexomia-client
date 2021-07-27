import { styled } from 'linaria/react';
import { css } from 'linaria';

import { useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import { BiHash } from 'react-icons/bi';
import {
  RiUserFill
} from 'react-icons/ri';
import classNames from 'classnames';
import StyledIconCss from '../css/StyledIconCss';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $UserCacheStore from '../../store/UserCacheStore';
import isTabGuild from '../../utils/isTabGuild';

const Header = styled.div`
  height: 48px;
  display: flex;
  alignSelf: stretch;
  align-items: center;
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

interface RouteParams {
  guildId: string,
  channelId: string
}

function ContentHeader() {
  const { guildId, channelId } = useParams<RouteParams>();
  const channelsCache = useStore($ChannelCacheStore);
  const usersCache = useStore($UserCacheStore);

  return (
    <Header>
      { guildId === '@profiles' && channelId !== 'people' && (
        <RiUserFill className={ classNames({ [StyledIconCss]: true, [HeaderIconCss]: true }) } />
      ) }

      { isTabGuild(guildId) && channelId && (
        channelsCache[channelId]?.name && (<BiHash className={ classNames({ [StyledIconCss]: true, [HeaderIconCss]: true }) } />)
      ) }

      { isTabGuild(guildId) && channelId && (
        <Content>{ channelsCache[channelId]?.name || '' }</Content>
      ) }

      { guildId === '@profiles' && channelId !== 'people' && (
        <Content>{ usersCache[channelId]?.username || '' }'s Profile</Content>
      ) }
    </Header>
  );
}

export default ContentHeader;