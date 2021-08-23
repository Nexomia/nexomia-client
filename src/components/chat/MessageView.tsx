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

  let prevMessage = '';

  useEffect(() => {
    if (
      !MessageStore[type === 0 ? channel : `0${channel}`] ||
      !MessageStore[type === 0 ? channel : `0${channel}`].length
    ) setLoading(true);
    if (
      (
        !MessageStore[type === 0 ? channel : `0${channel}`] ||
        !MessageStore[type === 0 ? channel : `0${channel}`].length
      ) &&
      CachedChannels[channel]
    ) {
      loadMessages();
      return;
    }
  }, [channel, CachedChannels]);

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
          MessageStore[type === 0 ? channel : `0${channel}`].length !== 0) && (
            MessageStore[type === 0 ? channel : `0${channel}`].map((message) => {
              const rendered =  (
                <MessageRenderer
                  id={ message }
                  key={ message }
                  grouped={ MessageCacheStore[prevMessage]?.author === MessageCacheStore[message]?.author }
                  channel={ channel }
                />
              );

              if (!MessageCacheStore[message].deleted) {
                prevMessage = type === 0 ? message : '';
                return rendered;
              } else {
                return null;
              }
            })
          )
        ) || ''
      ) }
    </Fragment>
  )

  async function loadMessages() {
    let response;

    if (type === 1) {
      response = await MessagesService.getChannelPins(channel);
    } else {
      response = await MessagesService.getChannelMessages(channel);
    }

    if (!response) return;
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
