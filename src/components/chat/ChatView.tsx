import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import { cacheMessages } from '../../store/MessageCacheStore';
import $MessageStore, { appendChannelMessages, clearLoadedMesssages } from '../../store/MessageStore';
import { ComputedPermissions } from '../../store/models/ComputedPermissions';
import $RoleCacheStore from '../../store/RolesCacheStore';
import PermissionCalculator from '../../utils/PermissionCalculator';

import MessagesService from '../../services/api/messages/messages.service';

import ChatInput from './ChatInput';
import MessageView from './MessageView';
import Message from '../../store/models/Message';
import $TypersStore from '../../store/TypersStore';
import Dots from '../animations/Dots';
import StyledText from '../ui/StyledText';
import $UserCacheStore from '../../store/UserCacheStore';
import getMemberColor from '../../utils/getMemberColor';
import { useTranslation } from 'react-i18next';

const MessageContainerWrapper = styled.div`
  flex-grow: 1;
`

const MessageContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% + 26px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const ScrollableContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden auto;
  box-sizing: border-box;
`

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100%;
  padding-bottom: 8px;
  justify-content: flex-end;
`

const TypersContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 16px;
  padding-left: 15px;
  margin-bottom: 20px;
`

interface ChatViewProps {
  channel: string
}

function ChatView({ channel }: ChatViewProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const Messages = useStore($MessageStore);
  const Channels = useStore($ChannelCacheStore);
  const Roles = useStore($RoleCacheStore);
  const Users = useStore($UserCacheStore);
  const Typers = useStore($TypersStore);

  const [inputVisible, setInputVisible] = useState(getSendPermission());
  const [loading, setLoading] = useState(false);
  const [oldHeight, setOldHeight] = useState(0);
  const [oldTop, setOldTop] = useState(0);

  const { t } = useTranslation(['chat']);

  useEffect(() => {
    setInputVisible(getSendPermission());
  }, [Roles]);

  useEffect(() => {
    if (!loading) {
      scrollView();
      document.title = `#${Channels[channel].name} - Nexomia`;
    } else {
      setLoading(false);
    }
  }, [channel, Messages[channel]]);

  return (
    <Fragment>
      <MessageContainerWrapper>
        <MessageContainer>
          <ScrollableContent ref={ scrollerRef } onScroll={ handleScroll }>
            <MessageWrapper>
              <MessageView channel={ channel } onMessagesLoaded={ scrollView } />
            </MessageWrapper>
            <TypersContainer>
              { !!Typers[channel]?.length && (
                <Fragment>
                  <Dots />
                  <StyledText className={ css`margin-left: 15px; margin-top: 0;` }>
                    { Typers[channel].map((user) => (
                      <Fragment>
                        <div style={{ color: getMemberColor(Channels[channel].guild_id || '', user), display: 'inline-block' }}>
                          { Users[user].username }
                        </div>
                        { Typers[channel].indexOf(user) !== Typers[channel].length - 1 && ', ' }
                      </Fragment>
                    )) }
                    { ' ' + (Typers[channel].length > 1 ? t('are_typing') : t('is_typing')) }
                  </StyledText>
                </Fragment>
              ) }
            </TypersContainer>
          </ScrollableContent>
        </MessageContainer>
      </MessageContainerWrapper>
      { inputVisible ? (
        <ChatInput channel={ channel } onMessageSent={ scrollView } />
      ) : <div className={ css`height: 26px` } /> }
    </Fragment>
  )

  function scrollView() {
    if (!loading) {
      scrollerRef.current?.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: scrollerRef?.current?.scrollTop > scrollerRef?.current?.scrollHeight - 100 - window.innerHeight
        ? 'smooth'
        : 'auto'
      });
    }
  }

  function getSendPermission() {
    return !!(PermissionCalculator.getUserPermissions(Channels[channel]?.guild_id || '', channel, '') & ComputedPermissions.WRITE_MESSAGES);
  }

  async function handleScroll() {
    if (!Messages[channel]) return;

    if (
      scrollerRef?.current?.scrollTop &&
      scrollerRef?.current?.scrollTop < 400 &&
      !loading
    ) {
      setLoading(true);
      const response = await MessagesService.getChannelMessages(channel, Messages[channel].length);
      if (!response || !response.length) return;
      cacheMessages(response);
      appendChannelMessages({ channel, messages: response.map((message: Message) => message.id) });
      setOldHeight(scrollerRef?.current?.scrollHeight);
    } else if (
      scrollerRef?.current?.scrollTop &&
      scrollerRef?.current?.scrollTop > scrollerRef?.current?.scrollHeight - 100 - window.innerHeight &&
      Messages[channel].length > 50
    ) {
      clearLoadedMesssages(channel);
    }
  }
}

export default ChatView;
