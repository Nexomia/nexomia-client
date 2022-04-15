import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import { cacheMessages } from '../../store/MessageCacheStore';
import $MessageStore, { appendChannelMessages, clearLoadedMesssages, leanArray } from '../../store/MessageStore';
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

import getNeededMessageCount from '../../utils/getNeededMessageCount';
import { useParams } from 'react-router';

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
  overflow-anchor: none;
`

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: calc(100% - 36px);
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

interface RouteParams {
  channelId: string
}

function ChatView() {
  const { channelId } = useParams<RouteParams>();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const Messages = useStore($MessageStore);
  const Channels = useStore($ChannelCacheStore);
  const Roles = useStore($RoleCacheStore);
  const Users = useStore($UserCacheStore);
  const Typers = useStore($TypersStore);

  const [permissions, setPermissions] = useState(getSendPermission(channelId));
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addedLoading, setAddedLoading] = useState(false);
  const [addScroll, setAddScroll] = useState(0);
  const [showTopMargin, setShowTopMargin] = useState(true);
  const [isTop, setTop] = useState(false);

  const { t } = useTranslation(['chat']);

  useEffect(() => {
    setShowTopMargin(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Roles, channelId, Channels]);

  useEffect(() => {
    setPermissions(PermissionCalculator.getUserPermissions(Channels[channelId]?.guild_id || '', channelId, ''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Roles, channelId, Channels]);

  useEffect(() => {
    if (!loading) {
      scrollView(true);
      document.title = `#${Channels[channelId].name} - Nexomia`;
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, loading]);

  useEffect(() => {
    if (!addedLoading) {
      setTimeout(() => {
        scrollerRef.current?.scrollTo({
          top: scrollerRef?.current?.scrollHeight - addScroll,
          behavior: 'auto'
        });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedLoading]);

  useEffect(() => {
    scrollView(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Messages[channelId]]);

  useEffect(() => {
    setTop(false)
  }, [channelId]);

  return (
    <Fragment>
      <MessageContainerWrapper>
        <MessageContainer>
          <ScrollableContent ref={ scrollerRef } onScroll={ handleScroll }>
            { Messages[channelId]?.length > 10 && showTopMargin && (
              <div className={ css`height: 3500px` } />
            ) }
            <MessageWrapper>
              { 
                !!(permissions & ComputedPermissions.VIEW_CHANNEL) && 
                <MessageView channel={ channelId } onMessagesLoaded={ () => scrollView(true) } />
              }
            </MessageWrapper>
            <TypersContainer>
              { !!Typers[channelId]?.length && (
                <Fragment>
                  <Dots />
                  <StyledText className={ css`margin-left: 15px; margin-top: 0;` }>
                    { Typers[channelId].map((user) => (
                      <Fragment>
                        <div style={{ color: getMemberColor(Channels[channelId].guild_id || '', user), display: 'inline-block' }}>
                          { Users[user].username }
                        </div>
                        { Typers[channelId].indexOf(user) !== Typers[channelId].length - 1 && ', ' }
                      </Fragment>
                    )) }
                    { ' ' + (Typers[channelId].length > 1 ? t('are_typing') : t('is_typing')) }
                  </StyledText>
                </Fragment>
              ) }
            </TypersContainer>
          </ScrollableContent>
        </MessageContainer>
      </MessageContainerWrapper>
      { permissions & (ComputedPermissions.WRITE_MESSAGES) &&
        permissions & (ComputedPermissions.VIEW_CHANNEL)  ? (
        <ChatInput
          channel={ channelId }
          onMessageSent={ () => scrollView(true) }
          onAttachmentAdded={ () => scrollView(true) }
        />
      ) : <div className={ css`height: 26px` } /> }
    </Fragment>
  )

  function scrollView(force: boolean) {
    if (
      !loading &&
      scrollerRef?.current &&
      (
        scrollerRef?.current?.scrollTop + scrollerRef?.current?.clientHeight > scrollerRef?.current?.scrollHeight - 600 ||
        force
      )
    ) {
      setTimeout(() => {
        scrollerRef.current?.scrollTo({
          top: scrollerRef.current.scrollHeight * 2,
          behavior: 'auto'
        });
      }, 0);
    }
  }

  function getSendPermission(id: string) {
    return PermissionCalculator.getUserPermissions(Channels[channelId]?.guild_id || '', id, '');
  }

  async function handleScroll() {
    if (!Messages[channelId] || isTop) return;

    if (
      scrollerRef?.current?.scrollTop &&
      scrollerRef?.current?.scrollTop < 3500 &&
      !addLoading
    ) {
      console.log('addload')
      setAddLoading(true);
      setAddedLoading(true);
      const response = await MessagesService.getChannelMessages(channelId, Messages[channelId].length, getNeededMessageCount());
      if (!response || !response.length) {
        setShowTopMargin(false);
        setAddedLoading(false);
        setTimeout(() => setAddLoading(false), 1000);
        setTop(true)
        return;
      }
      setAddScroll(scrollerRef?.current?.scrollHeight - scrollerRef?.current?.scrollTop);
      cacheMessages(response);
      appendChannelMessages({ channel: channelId, messages: response.map((message: Message) => message.id) });
      setAddedLoading(false);
      setTimeout(() => setAddLoading(false), 1000);
    } else if (
      scrollerRef?.current?.scrollTop &&
      scrollerRef?.current?.scrollTop + scrollerRef?.current?.clientHeight > scrollerRef?.current?.scrollHeight - 100 &&
      Messages[channelId].length > getNeededMessageCount()
    ) {
      clearLoadedMesssages(channelId);
      leanArray(channelId);
    }
  }
}

export default ChatView;
