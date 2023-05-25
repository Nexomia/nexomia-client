import { Fragment, useEffect, useState } from 'react';
import { css } from 'linaria';
import Dots from '../animations/Dots';
import CenteredContainer from '../layout/CenteredContainer';
import MessageRenderer from './MessageRenderer';

import { useStore } from 'effector-react';
import $MessageStore, { setChannelMessages } from '../../store/MessageStore';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $MessageCacheStore, { cacheMessages } from '../../store/MessageCacheStore';
import MessagesService from '../../services/api/messages/messages.service';
import Message from '../../store/models/Message';
import StyledText from '../ui/StyledText';
import { useTranslation } from 'react-i18next';
import getNeededMessageCount from '../../utils/getNeededMessageCount';

interface MessageViewProps {
  channel: string,
  onMessagesLoaded?: any,
  type?: number
}

function MessageView({ channel, onMessagesLoaded = () => null, type = 0 }: MessageViewProps) {
  const [loading, setLoading] = useState(false);
  const MessageStore = useStore($MessageStore);
  const MessageCacheStore = useStore($MessageCacheStore);
  const CachedChannels = useStore($ChannelCacheStore);

  const { t } = useTranslation(['chat']);

  let prevMessage = '';

  useEffect(() => {
    if (
      (
        !MessageStore[type === 0 ? channel : `0${channel}`]
      ) &&
      CachedChannels[channel]
    ) {
      setLoading(true);
      loadMessages();
      return;
    }
    
  }, [MessageStore[type === 0 ? channel : `0${channel}`]]);

  return (
    <Fragment>
      { loading ? (
        <CenteredContainer className={ css`margin-bottom: 64px` }>
          <Dots />
        </CenteredContainer>
      ) : (
        (
          MessageStore[type === 0 ? channel : `0${channel}`] &&
          (MessageStore[type === 0 ? channel : `0${channel}`].length &&
          MessageStore[type === 0 ? channel : `0${channel}`].length !== 0) ? (
            MessageStore[type === 0 ? channel : `0${channel}`].map((message, index) => {
              const rendered =  (
                <MessageRenderer
                  id={ message }
                  key={ message }
                  grouped={ MessageCacheStore[prevMessage]?.author === MessageCacheStore[message]?.author && MessageCacheStore[message]?.created - MessageCacheStore[prevMessage]?.created < 900000 }
                  channel={ channel }
                  last={index === MessageStore[type === 0 ? channel : `0${channel}`].length - 1}
                  unread={ (MessageCacheStore[prevMessage]?.author !== MessageCacheStore[message].author && (BigInt(MessageCacheStore[prevMessage]?.id || 0) <= BigInt(CachedChannels[channel].last_read_snowflake || 0)) && BigInt(message) > BigInt(CachedChannels[channel].last_read_snowflake || 0)) ? true : false }
                />
              );

              if (!MessageCacheStore[message].deleted) {
                prevMessage = type === 0 && !MessageCacheStore[message]?.type ? message : ''; 
                return rendered;
              } else {
                return null;
              }
            })
          ) : (
            <StyledText className={ css`margin-left: 16px` }>
              { type === 0 ? (
                t('conv_start')!
              ) : (
                t('conv_start_pin')!
              ) }
            </StyledText>
          )
        )
      ) }
    </Fragment>
  )

  async function loadMessages() {
    let response;

    if (type === 1) {
      response = await MessagesService.getChannelPins(channel);
    } else {
      response = await MessagesService.getChannelMessages(channel, 0, getNeededMessageCount());
    }

    if (!response) return setLoading(false);;
    cacheMessages(response);
    setChannelMessages({
      channel: type === 0 ? channel : `0${channel}`,
      messages: (type === 0 ? response : response.reverse()).map((message: Message) => message.id)
    });
    setLoading(false);
    onMessagesLoaded();
  }
}

export default MessageView;
