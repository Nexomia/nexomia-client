import { Fragment, useEffect, useState } from 'react';
import { css } from 'linaria';
import Dots from '../animations/Dots';
import CenteredContainer from '../layout/CenteredContainer';
import MessageRenderer from './MessageRenderer';

import { useStore } from 'effector-react';
import $MessageStore, { setChannelMessages } from '../../store/MessageStore';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import { cacheMessages } from '../../store/MessageCacheStore';
import { cacheUsers } from '../../store/UserCacheStore';
import MessagesService from '../../services/api/messages/messages.service';
import GuildsService from '../../services/api/guilds/guilds.service';
import Message from '../../store/models/Message';

interface MessageViewProps {
  channel: string
}

function MessageView({ channel }: MessageViewProps) {
  const [loading, setLoading] = useState(false);
  const MessageStore = useStore($MessageStore);
  const CachedChannels = useStore($ChannelCacheStore);

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
            <MessageRenderer id={ message } key={ message } />
          ))
        )
      ) }
    </Fragment>
  )

  async function loadMessages() {
    const response = await MessagesService.getChannelMessages(channel);
    if (!response) return setLoading(false);
    
    const membersResponse = await GuildsService.getGuildMembers(CachedChannels[channel].guild_id || '');

    cacheUsers(membersResponse.map((member: any) => member.user));
    cacheMessages(response);
    setChannelMessages({ channel, messages: response.map((message: Message) => message.id) });
    setLoading(false);
  }
}

export default MessageView;
