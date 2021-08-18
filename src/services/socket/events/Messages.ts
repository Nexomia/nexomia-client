import $MessageCacheStore, { cacheMessages, patchMessage } from '../../../store/MessageCacheStore';
import $MessageStore, { addMessage, deleteMessage } from '../../../store/MessageStore';
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
    deleteMessage({ message: event.info.data.id, channel: event.info.data.channel_id });
  }
}

export default new MessageEventHandler();
