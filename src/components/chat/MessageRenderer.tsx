  import classNames from 'classnames';
  import { useStore } from 'effector-react';
  import { format } from 'fecha';
  import { css } from 'linaria';
  import { styled } from 'linaria/react';
  import { useNavigate, useParams } from 'react-router-dom';
  import $MessageCacheStore from '../../store/MessageCacheStore';
  import $UserCacheStore from '../../store/UserCacheStore';
  import $ChannelCacheStore from '../../store/ChannelCacheStore';
  import StyledText from '../ui/StyledText';
  import $ContextMenuStore, { setContextMenu } from '../../store/ContextMenuStore';
  import getMemberColor from '../../utils/getMemberColor';
  import getIconString from '../../utils/getIconString';
  import { RiArrowLeftLine, RiArrowRightLine, RiPushpinFill } from 'react-icons/ri';
  import StyledIconCss from '../css/StyledIconCss';
  import { useTranslation } from 'react-i18next';
  import renderMessageContent from '../../utils/renderMessageContent';
  import { Fragment, useEffect, useRef, useState } from 'react';
  import Dots from '../animations/Dots';
  import $InputStore from '../../store/InputStore';
  import Attachment from '../../store/models/Attachment';
  import ImageRenderer from './attachments/ImageRenderer';
  import AudioRenderer from './attachments/AudioRenderer';
  import GenericRenderer from './attachments/GenericRenderer';
  import TextRenderer from './attachments/TextRenderer';
  import EmoteHoverEffect from '../css/EmoteHoverEffect';
  import { setModalState } from '../../store/ModalStore';
  import $UnreadStore, { removeUnread } from '../../store/UnreadStore';
  import channelsService from '../../services/api/channels/channels.service';
  import $UserStore from '../../store/UserStore';
  import VideoRenderer from './attachments/VideoRenderer';
  import Prism from "prismjs";

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
      background: var(--background-secondary-alt2);
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

  const ForwardsContainer = styled.div`
    display: flex;
    flex-direction: row;
  `

  const ForwardDivider = styled.div`
    width: 4px;
    border-radius: 2px;
    margin: 8px 12px 8px 8px;
    background: var(--accent);
  `

  const FloatingDivider = styled.div`
    width: 4px;
    border-radius: 2px;
    margin: 2px -10px 2px 6px;
    background: var(--accent);
  `

  const ForwardedMessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-top: -8px;
  `

  const MessageContentCss = css`
    margin: 0;
    padding-right: 16px;
    font-weight: 400;
    user-select: text;
    word-break: break-all;
    white-space: break-spaces;

  `

  interface MessageProps {
    id: string,
    grouped: boolean,
    avatar?: boolean,
    date?: boolean,
    channel: string,
    last?: boolean,
    unread?: boolean,
  }

  function MessageRenderer({ id, grouped, avatar = true, date = true, channel, last = false, unread = false, }: MessageProps) {
    const UserCache = useStore($UserCacheStore);
    const MessageCache = useStore($MessageCacheStore);
    const ChannelCache = useStore($ChannelCacheStore);
    const ContextMenu = useStore($ContextMenuStore);
    const Unread = useStore($UnreadStore);

    const InputCache = useStore($InputStore);

    const [hovered, setHovered] = useState(false);

    const { t } = useTranslation(['chat']);

    interface RouteParams {
      guildId: string,
      channelId: string
    }
    const { channelId } = useParams<RouteParams>();

    const navigate = useNavigate();
    const User = $UserStore.getState();

    const textRef = useRef<HTMLDivElement>(null);
    if (!id.startsWith('$') && channel === channelId && Unread[ChannelCache[channel].guild_id || '@me'] && Unread[ChannelCache[channel].guild_id || '@me']?.find(un => !un.message_ids.includes(id)) && MessageCache[id].mentions?.includes(User.id)) {
      removeUnread({guildId: ChannelCache[channel].guild_id || '@me', channelId: ChannelCache[channel].id, message_id: id});
    }
    if (last && Unread[ChannelCache[channel].guild_id || '@me']?.find(ch => ch.channel_id === channel && !ch.message_ids.length)) {
      channelsService.readChannel(channel);
      removeUnread({ guildId: ChannelCache[channel].guild_id || '@me', channelId: ChannelCache[channel].id, message_id: id });
    }

    useEffect(() => {
      Prism.highlightAll();
    }, []);

    return (
      <Container
        className={ classNames(
          (grouped && !MessageCache[id].type) && GroupedContainerCss,
          ContextMenu?.id === id && ContextMenu?.visible && avatar && 'active',
          !avatar && css`animation: none;`,
          unread && css`border-top: 1px solid var(--text-negative); border-top-left-radius: 8px;`,
        ) }
        onContextMenu={ openContextMenu }
        onMouseEnter={ () => setHovered(true) }
        onMouseLeave={ () => setHovered(false) }
      >
        { InputCache[channel] && InputCache[channel]?.forwards?.includes(id) && avatar && <FloatingDivider /> }
        { UserCache[MessageCache[id].author] ? (
          <Fragment>
            { !grouped && !MessageCache[id].type ? (
              UserCache[MessageCache[id].author].avatar && avatar ? (
                <Avatar src={ UserCache[MessageCache[id].author].avatar } onClick={ showUserProfile } className={ css`background: transparent` }></Avatar>
              ) : avatar ? (
                <LetterAvatar onClick={ showUserProfile }>{ getIconString(UserCache[MessageCache[id].author].username || '') }</LetterAvatar>
              ) : null
            ) : !MessageCache[id].type && date ? (
              <Spacer>{ format(new Date(MessageCache[id].created), 'HH:mm') }</Spacer>
            ) : date ? (
              <Spacer>
                { MessageCache[id].type === 5 ? (
                  <RiArrowLeftLine className={ classNames(StyledIconCss, MessageIconCss, LeaveColorCss) } />
                ) : MessageCache[id].type === 4 ? (
                  <RiArrowRightLine className={ classNames(StyledIconCss, MessageIconCss, JoinColorCss) } />
                ) : MessageCache[id].type === 3 ? (
                  <RiPushpinFill className={ classNames(StyledIconCss, MessageIconCss) } />
                ) : null }
              </Spacer>
            ) : null }
            <ContentContainer>
              { (!grouped || MessageCache[id].type) ? (
                <StyledText className={ css`margin: 0` }>
                  <div
                    className={ css`
                      display: inline-block;
                      cursor: pointer;
                      @-moz-document url-prefix() {
                        margin-top: 1px;
                      }
                    ` }
                    ref={ textRef }
                    >
                    <span
                    onClick={ showUserProfile }
                    style={{
                      background: getMemberColor(ChannelCache[channel].guild_id || '', MessageCache[id].author) || 'var(--text-primary)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    { UserCache[MessageCache[id].author].username }
                    </span>
                    <span className={ css`color: var(--text-primary); &:hover { text-decoration: underline; }` }>
                      { MessageCache[id].type === 5 ? ' ' + t('left_the_server')! : '' }
                      { MessageCache[id].type === 4 ? ' ' + t('joined_the_server')! : '' }
                      { MessageCache[id].type === 3 ? ' ' + t('pinned_a_message')! : '' }
                    </span>
                  </div>
                  <StyledText className={ css`margin: 0 0 0 8px; color: var(--text-secondary); display: inline-block; font-size: 12px` }>
                    {
                      Math.floor(Date.now() / 86400000) * 86400000 - 86400000 < MessageCache[id].created ? (
                        (
                          Math.floor(Date.now() / 86400000) * 86400000 > MessageCache[id].created
                          ? t('date.yesterday')!
                          : ''
                        )
                        + format(new Date(MessageCache[id].created), 'HH:mm')
                      ) : format(new Date(MessageCache[id].created), 'DD.MM.YYYY HH:mm')
                    }
                  </StyledText>
                </StyledText>
              ) : null }
              { !!((MessageCache[id].forwarded_messages && MessageCache[id].forwarded_messages.length)) && (
                <ForwardsContainer>
                  <ForwardDivider />
                  <ForwardedMessagesContainer>
                    {
                      MessageCache[id].forwarded_messages.map((forwarded, index) => (
                        <MessageRenderer
                          id={ '$' + forwarded.id }
                          key={ '$' +  forwarded.id }
                          grouped={ forwarded.author === MessageCache[id].forwarded_messages[index - 1]?.author && forwarded.channel_id === MessageCache[id]?.forwarded_messages[index - 1].channel_id && forwarded.created - MessageCache[id].forwarded_messages[index - 1]?.created < 900000 }
                          channel={ channel }
                          avatar={ false }
                          date={ false }
                        />
                      ))
                    }
                  </ForwardedMessagesContainer>
                </ForwardsContainer>
              ) }
              { !!MessageCache[id].content && (
                <StyledText
                  className={ classNames(MessageContentCss) }
                >
                  { renderMessageContent(MessageCache[id].content || '') }
                </StyledText>
              ) }
              { !!MessageCache[id]?.attachments?.length && MessageCache[id]?.attachments?.map((attachment: Attachment) => (
                attachment.mime_type.startsWith('image') ? (
                  <ImageRenderer file={ attachment } hovered={ hovered } />
                  ) : attachment.mime_type.startsWith('audio') || (attachment.mime_type.startsWith('video/webm') && !attachment.data?.preview_url) ? (
                    <AudioRenderer file={ attachment } />
                  ) : attachment.mime_type.startsWith('video') || (attachment.mime_type.startsWith('video/webm') && attachment.data?.preview_url) ? (
                    <VideoRenderer file={ attachment } />
                  ) : attachment.mime_type.startsWith('text') ? (
                  <TextRenderer file={ attachment } />
                ) : (
                  <GenericRenderer file={ attachment } />
                )
              )) }

              { MessageCache[id].sticker && (
                <img
                  alt={ `sticker_${MessageCache[id].sticker?.name}` }
                  src={ MessageCache[id].sticker?.url }
                  className={ classNames(css`width: 150px; height: 150px; user-select: none; user-drag: none;`, EmoteHoverEffect) }
                  onClick={ () => setModalState({ emojiPack: [true, MessageCache[id].sticker?.pack_id] }) }
                />
              ) }
            </ContentContainer>
          </Fragment>
        ) : (
          <Dots />
        ) }
      </Container>
    )

    function showUserProfile() {
      navigate(`/app/profiles/${ MessageCache[id].author }`);
    }

    function openContextMenu(event: any) {
      event.preventDefault();
      setContextMenu({ type: 'message', top: event.pageY, left: event.pageX, visible: true, id });
    }
  }

  export default MessageRenderer;
