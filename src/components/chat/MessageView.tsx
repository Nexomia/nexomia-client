import { Fragment, useEffect, useState } from 'react';
import { css } from 'linaria';
import Dots from '../animations/Dots';
import CenteredContainer from '../layout/CenteredContainer';
import MessageRenderer from './MessageRenderer';

import { useStore } from 'effector-react';
import $MessageStore, { setChannelMessages } from '../../store/MessageStore';
import $ChannelCacheStore from '../../store/ChannelCacheStore';
import $MessageCacheStore, { cacheMessages } from '../../store/MessageCacheStore';
import { cacheUsers } from '../../store/UserCacheStore';
import { cacheMembers } from '../../store/MemberCacheStore';
import MessagesService from '../../services/api/messages/messages.service';
import GuildsService from '../../services/api/guilds/guilds.service';
import Message from '../../store/models/Message';

interface MessageViewProps {
  channel: string
}

function MessageView({ channel }: MessageViewProps) {
  const [loading, setLoading] = useState(false);
  const MessageStore = useStore($MessageStore);
  const MessageCacheStore = useStore($MessageCacheStore);
  const CachedChannels = useStore($ChannelCacheStore);

  let prevMessage = '';

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
          MessageStore[channel].map((message) => {
            const rendered =  (
              <MessageRenderer
                id={ message }
                key={ message }
                grouped={ MessageCacheStore[prevMessage]?.author === MessageCacheStore[message]?.author }
              />
            );

            prevMessage = message;
            return rendered;
          })
        )
      ) }
    </Fragment>
  )

  async function loadMessages() {
    const response = await MessagesService.getChannelMessages(channel);
    if (!response) return setLoading(false);
    
    const membersResponse = await GuildsService.getGuildMembers(CachedChannels[channel].guild_id || '');

    cacheUsers([...membersResponse].map((member: any) => member.user));
    cacheMembers([...membersResponse].map((member: any) => {
      delete member.user;
      return { ...member, guild: CachedChannels[channel].guild_id }
    }));
    cacheMessages(response);
    setChannelMessages({ channel, messages: response.map((message: Message) => message.id) });
    setLoading(false);
  }
}

export default MessageView;
