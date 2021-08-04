import $MessageCacheStore, { cacheMessages } from '../../../store/MessageCacheStore';
import { addMessage } from '../../../store/MessageStore';
import CustomMessageEvent from '../models/CustomMessageEvent';

class MessageEventHandler {
  messageCreated(event: CustomMessageEvent) {
    const MessageCache = $MessageCacheStore.getState();

    if (MessageCache[event.info.data.id]) return;

    cacheMessages([event.info.data]);
    addMessage({ channel: event.info.data.channel_id, message: event.info.data.id });
  }
}

export default new MessageEventHandler();
