import { styled } from 'linaria/react';
import { css } from 'linaria';

import { useStore } from 'effector-react';
import { useParams } from 'react-router-dom';
import { BiHash } from 'react-icons/bi';
import classNames from 'classnames';
import StyledIconCss from '../css/StyledIconCss';
import $ChannelCacheStore from '../../store/ChannelCacheStore';

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
  channelId: string
}

function ContentHeader() {
  const { channelId } = useParams<RouteParams>();
  const channelsCache = useStore($ChannelCacheStore);

  return (
    <Header>
      { channelsCache[channelId]?.name && (<BiHash className={ classNames({ [StyledIconCss]: true, [HeaderIconCss]: true }) } />) }
      <Content>{ channelsCache[channelId]?.name || '' }</Content>
    </Header>
  );
}

export default ContentHeader;