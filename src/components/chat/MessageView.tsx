import { Fragment, useEffect, useState } from 'react';
import { css } from 'linaria';
import Dots from '../animations/Dots';
import CenteredContainer from '../layout/CenteredContainer';

import { useStore } from 'effector-react';
import $MessageStore, { setChannelMessages } from '../../store/MessageStore';
import { cacheMessages } from '../../store/MessageCacheStore';
import messagesService from '../../services/api/messages/messages.service';
import Message from '../../store/models/Message';

interface MessageViewProps {
  channel: string
}

function MessageView({ channel }: MessageViewProps) {
  const [loading, setLoading] = useState(false);
  const MessageStore = useStore($MessageStore);

  useEffect(() => {
    if (!MessageStore[channel] || !MessageStore[channel].length) {
      setLoading(true);
      loadMessages();
      return;
    }
  }, [channel]);

  return (
    <Fragment>
      { loading ? (
        <CenteredContainer className={ css`margin-bottom: 64px` }>
          <Dots />
        </CenteredContainer>
      ) : (
        MessageStore[channel] && MessageStore[channel].length && (
          MessageStore[channel].map((message) => (
            <div>{ message }</div>
          ))
        )
      ) }
    </Fragment>
  )

  async function loadMessages() {
    const response = await messagesService.getChannelMessages(channel);

    if (!response) return setLoading(false);

    cacheMessages(response);
    setChannelMessages({ channel, messages: response.map((message: Message) => message.id) });
    setLoading(false);
  }
}

export default MessageView;
