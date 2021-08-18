import $MessageCacheStore, { cacheMessages, patchMessage } from '../../../store/MessageCacheStore';
import $MessageStore, { addMessage } from '../../../store/MessageStore';
import CustomMessageEvent from '../models/CustomMessageEvent';
class MessageEventHandler {
  messageCreated(event: CustomMessageEvent) {
    const MessageCache = $MessageCacheStore.getState();
    const Messages = $MessageStore.getState();

    if (
      MessageCache[event.info.data.id] ||
      !Messages[event.info.data.channel_id]?.length
    ) return;

    cacheMessages([event.info.data]);
    addMessage({ channel: event.info.data.channel_id, message: event.info.data.id });
  }

  messageDeleted(event: CustomMessageEvent) {
    patchMessage({ id: event.info.data.id, deleted: true });
  }
}

export default new MessageEventHandler();
