import { styled } from 'linaria/react';
import { css } from 'linaria';
import classNames from 'classnames';

import { useParams } from 'react-router-dom';

import { IconType } from 'react-icons/lib';
import StyledIconCss from '../css/StyledIconCss';
import StyledText from '../ui/StyledText';
import { setContextMenu } from '../../store/ContextMenuStore';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import { useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import $UnreadStore from '../../store/UnreadStore';

const Container = styled.div`
  margin: 0 8px 8px 8px;
  padding: 6px 6px;
  border-radius: 4px;
  height: 36px;
  display: flex;
  position: relative;
  alignSelf: stretch;
  flex-direction: row;
  cursor: pointer;
  transition: .2s;
  &:hover {
    background: var(--background-primary);
  }
  &.active {
    background: var(--accent);
  }
  &:active {
    transform: scale(0.98);
  }
`

const TabIconCss = css`
  width: 24px;
  height: 24px;
  margin-right: 3px;
`

const TextCss = css`
  margin-top: 1px;
  margin-left: 2px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  @-moz-document url-prefix() {
    margin-top: 2px;
  }
`

const ColorCss = css`
  color: var(--text-negative);
`
const Unread = styled.div`
    position: absolute;
    height: 8px;
    border: 3px solid #fff;
    border-radius: 0 4px 4px 0;
    margin-left: -16px;
    top: calc(50% - 4px);
`

interface TabProps {
  Icon?: IconType,
  title: string,
  active?: boolean,
  tabId?: string,
  contextEnabled?: boolean,
  onClick?: any
  negative?: boolean
}

interface RouteParams {
  guildId: string,
  channelId: string
}

function Tab({ Icon, title, active, onClick, tabId, negative, contextEnabled = false }: TabProps) {
  const ChannelCache = useStore($ChannelCacheStore);
  const Unreads = useStore($UnreadStore);

  const { guildId, channelId } = useParams<RouteParams>();
  const [unread, setUnread] = useState<boolean>();

  useEffect(() => {
    if (tabId && Unreads[ChannelCache[tabId]?.guild_id || '@me']?.find(ch => ch.channel_id === tabId)) {
      setUnread(true);
    } else {
      setUnread(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Unreads]);

  return (
    <Container
      onClick={ onClick }
      onContextMenu={ openContextMenu }
      className={ classNames({ active: active || tabId === channelId || tabId === guildId }) }
    >
      { tabId && ChannelCache[tabId] && tabId !== channelId && tabId !== 'new' && unread && <Unread /> }
      { Icon && <Icon className={ classNames({ [StyledIconCss]: true, [TabIconCss]: true }) } /> }
      <StyledText className={ classNames(TextCss, negative ? ColorCss : null) }>{ title }</StyledText>
    </Container>
  );

  function openContextMenu(event: any) {
    event.preventDefault();
    setContextMenu({ type: 'channel', top: event.pageY, left: event.pageX, visible: true, id: tabId });
  }
}

export default Tab;
