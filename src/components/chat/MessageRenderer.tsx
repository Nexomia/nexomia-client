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
import getIconString from '../../utils/getIconString';
import { RiArrowRightLine } from 'react-icons/ri';
import StyledIconCss from '../css/StyledIconCss';

const Spacer = styled.div`
  display: flex;
  justify-content: center;
  width: 72px;
  flex-shrink: 0;
  color: transparent;
  text-align: center;
  user-select: none;
  font-size: 12px;
  line-height: 20px;
  font-weight: 600;
`

const Container = styled.div`
  margin-top: 8px;
  margin-bottom: -1px;
  padding: 4px 0;
  display: flex;
  flex-direction: row;

  &:hover {
    background: var(--background-secondary-alt);
  }

  &:hover > ${Spacer} {
    color: var(--text-secondary);
  }
`

const GroupedContainerCss = css`
  margin: 0;
`

const AvatarCss = `
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
  line-height: 40px;
  height: 40px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--background-light);
  flex-shrink: 0;
`

const MessageIconCss = css`
  width: 24px;
  height: 24px;
`

const JoinColorCss = css`
  color: var(--accent-green);
`

const Avatar = styled.img`${AvatarCss}`
const LetterAvatar = styled.div`${AvatarCss}`

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
      { !grouped && !MessageCache[id].type ? (
        UserCache[MessageCache[id].author].avatar ? (
          <Avatar src={ UserCache[MessageCache[id].author].avatar } onClick={ showUserProfile } className={ css`background: transparent` }></Avatar>
        ) : (
          <LetterAvatar onClick={ showUserProfile }>{ getIconString(UserCache[MessageCache[id].author].username || '') }</LetterAvatar>
        )
      ) : !MessageCache[id].type ? (
        <Spacer>{ format(new Date(MessageCache[id].created), 'HH:mm') }</Spacer>
      ) : (
        <Spacer>
          <RiArrowRightLine className={ classNames(StyledIconCss, MessageIconCss, JoinColorCss) } />
        </Spacer>
      ) }
      <ContentContainer>
        { !grouped && (
          <StyledText className={ css`margin: 0` }>
            <div
              className={ css`display: inline-block; cursor: pointer; &:hover { text-decoration: underline }` }
              style={{ color: getMemberColor(ChannelCache[channel].guild_id || '', MessageCache[id].author) }}
              onClick={ showUserProfile }
            >
              { UserCache[MessageCache[id].author].username }
              <span className={ css`color: var(--text-primary)` }>{ MessageCache[id].type === 4 ? ' joined the server' : '' }</span>
            </div>
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
