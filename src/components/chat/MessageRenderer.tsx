import classNames from 'classnames';
import { useStore } from 'effector-react';
import { format } from 'fecha';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useHistory } from 'react-router-dom';
import $MessageCacheStore from '../../store/MessageCacheStore';
import $UserCacheStore from '../../store/UserCacheStore';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import StyledText from '../ui/StyledText';
import { setContextMenu } from '../../store/ContextMenuStore';
import getMemberColor from '../../utils/getMemberColor';

const Container = styled.div`
  margin-top: 8px;
  margin-bottom: -1px;
  padding: 4px 0;
  display: flex;
  flex-direction: row;

  &:hover {
    background: var(--background-secondary-alt);
  }
`

const GroupedContainerCss = css`
  margin: 0;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 16px;
  user-select: none;
  cursor: pointer;
  transition: .2s;
  &:active {
    transform: translateY(2px);
  }
`

const Spacer = styled.div`
  width: 72px;
  flex-shrink: 0;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

interface MessageProps {
  id: string,
  grouped: boolean,
  channel: string
}

function MessageRenderer({ id, grouped, channel }: MessageProps) {
  const UserCache = useStore($UserCacheStore);
  const MessageCache = useStore($MessageCacheStore);
  const ChannelCache = useStore($ChannelCacheStore);

  const history = useHistory();

  return (
    <Container className={ classNames({ [GroupedContainerCss]: grouped }) } onContextMenu={ openContextMenu } >
      { !grouped ? (
        <Avatar src={ UserCache[MessageCache[id].author].avatar } onClick={ showUserProfile }></Avatar>
      ) : (
        <Spacer />
      ) }
      <ContentContainer>
        { !grouped && (
          <StyledText className={ css`margin: 0` }>
            <div
              className={ css`display: inline-block; cursor: pointer; &:hover { text-decoration: underline }` }
              style={{ color: getMemberColor(ChannelCache[channel].guild_id || '', MessageCache[id].author) }}
              onClick={ showUserProfile }
            >{ UserCache[MessageCache[id].author].username }</div>
            <StyledText className={ css`margin: 0 0 0 8px; color: var(--text-secondary); display: inline-block; font-size: 12px` }>
              { format(new Date(MessageCache[id].created), 'HH:mm') }
            </StyledText>
          </StyledText>
        ) }
        <StyledText className={ css`margin: 0; padding-right: 16px; font-weight: 400; user-select: text; word-break: break-all` }>{ MessageCache[id].content }</StyledText>
      </ContentContainer>
    </Container>
  )

  function showUserProfile() {
    history.push(`/profiles/${ MessageCache[id].author }`);
  }

  function openContextMenu(event: any) {
    event.preventDefault();
    setContextMenu({ type: 'message', top: event.pageY, left: event.pageX, visible: true, id });
  }
}

export default MessageRenderer;
