import { styled } from 'linaria/react';
import { css } from 'linaria';
import classNames from 'classnames';

import { useParams } from 'react-router-dom';

import { IconType } from 'react-icons/lib';
import StyledIconCss from '../css/StyledIconCss';
import StyledText from '../ui/StyledText';
import { setContextMenu } from '../../store/ContextMenuStore';

const Container = styled.div`
  margin: 0 8px 8px 8px;
  padding: 6px 6px;
  border-radius: 4px;
  height: 36px;
  display: flex;
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
`

const TextCss = css`
  margin-top: 1px;
  margin-left: 4px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

interface TabProps {
  Icon?: IconType,
  title: string,
  active?: boolean,
  tabId?: string,
  contextEnabled?: boolean,
  onClick?: any
}

interface RouteParams {
  guildId: string,
  channelId: string
}

function Tab({ Icon, title, active, onClick, tabId, contextEnabled = false }: TabProps) {
  const { guildId, channelId } = useParams<RouteParams>();

  return (
    <Container
      onClick={ onClick }
      onContextMenu={ openContextMenu }
      className={ classNames({ active: active || tabId === channelId || tabId === guildId }) }
    >
      { Icon && <Icon className={ classNames({ [StyledIconCss]: true, [TabIconCss]: true }) } /> }
      <StyledText className={ TextCss }>{ title }</StyledText>
    </Container>
  );

  function openContextMenu(event: any) {
    event.preventDefault();
    setContextMenu({ type: 'channel', top: event.pageY, left: event.pageX, visible: true, id: tabId });
  }
}

export default Tab;
