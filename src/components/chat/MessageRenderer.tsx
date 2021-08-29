import classNames from 'classnames';
import { useStore } from 'effector-react';
import { format } from 'fecha';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useHistory } from 'react-router-dom';
import $MessageCacheStore from '../../store/MessageCacheStore';
import $UserCacheStore, { cacheUsers } from '../../store/UserCacheStore';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import StyledText from '../ui/StyledText';
import $ContextMenuStore, { setContextMenu } from '../../store/ContextMenuStore';
import getMemberColor from '../../utils/getMemberColor';
import getIconString from '../../utils/getIconString';
import { RiArrowLeftLine, RiArrowRightLine, RiPushpinFill } from 'react-icons/ri';
import StyledIconCss from '../css/StyledIconCss';
import { useTranslation } from 'react-i18next';
import renderMessageContent from '../../utils/renderMessageContent';
import UsersService from '../../services/api/users/users.service';
import { Fragment, useEffect } from 'react';
import Dots from '../animations/Dots';

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
  animation: appear .2s;

  &:hover, &.active {
    background: var(--background-secondary-alt);
  }

  &:hover > ${Spacer} {
    color: var(--text-secondary);
  }

  @keyframes appear {
    from {
      transform: translateY(40px);
      opacity: 0;
    }

    to {
      transform: translateY(0px);
      opacity: 1;
    }
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

const LeaveColorCss = css`
  color: var(--text-negative);
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
  const ContextMenu = useStore($ContextMenuStore);

  const { t } = useTranslation(['chat']);

  const history = useHistory();

  return (
    <Container
      className={ classNames({ [GroupedContainerCss]: (grouped && !MessageCache[id].type), active: ContextMenu?.id === id && ContextMenu?.visible }) }
      onContextMenu={ openContextMenu }
    >
      { UserCache[MessageCache[id].author] ? (
        <Fragment>
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
              { MessageCache[id].type === 5 ? (
                <RiArrowLeftLine className={ classNames(StyledIconCss, MessageIconCss, LeaveColorCss) } />
              ) : MessageCache[id].type === 4 ? (
                <RiArrowRightLine className={ classNames(StyledIconCss, MessageIconCss, JoinColorCss) } />
              ) : MessageCache[id].type === 3 ? (
                <RiPushpinFill className={ classNames(StyledIconCss, MessageIconCss) } />
              ) : null }
            </Spacer>
          ) }
          <ContentContainer>
            { (!grouped || MessageCache[id].type) ? (
              <StyledText className={ css`margin: 0` }>
                <div
                  className={ css`display: inline-block; cursor: pointer; &:hover { text-decoration: underline }` }
                  style={{ color: getMemberColor(ChannelCache[channel].guild_id || '', MessageCache[id].author) }}
                  onClick={ showUserProfile }
                >
                  { UserCache[MessageCache[id].author].username }
                  <span className={ css`color: var(--text-primary)` }>
                    { MessageCache[id].type === 5 ? ' ' + t('left_the_server') : '' }
                    { MessageCache[id].type === 4 ? ' ' + t('joined_the_server') : '' }
                    { MessageCache[id].type === 3 ? ' ' + t('pinned_a_message') : '' }
                  </span>
                </div>
                <StyledText className={ css`margin: 0 0 0 8px; color: var(--text-secondary); display: inline-block; font-size: 12px` }>
                  { format(new Date(MessageCache[id].created), 'HH:mm') }
                </StyledText>
              </StyledText>
            ) : null }
            <StyledText
              className={ css`margin: 0; padding-right: 16px; font-weight: 400; user-select: text; word-break: break-all; white-space: break-spaces;` }
            >{ renderMessageContent(MessageCache[id].content || '') }</StyledText>
          </ContentContainer>
        </Fragment>
      ) : (
        <Dots />
      ) }
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
