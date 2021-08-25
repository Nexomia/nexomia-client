import $MessageCacheStore, { cacheMessages, patchMessage } from '../../../store/MessageCacheStore';
import $MessageStore, { preaddMessage, addMessage, deleteMessage } from '../../../store/MessageStore';
import { removeTyper } from '../../../store/TypersStore';
import MessagesService from '../../api/messages/messages.service';
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
    removeTyper({ channel: event.info.data.channel_id, user: event.info.data.author });
  }

  messageDeleted(event: CustomMessageEvent) {
    patchMessage({ id: event.info.data.id, deleted: true });
    deleteMessage({ message: event.info.data.id, channel: event.info.data.channel_id });
  }

  async messagePinned(event: CustomMessageEvent) {
    const MessageCache = $MessageCacheStore.getState();

    if (!MessageCache[event.info.data.id]) {
      const response = await MessagesService.getMessage(event.info.data.channel_id, event.info.data.id);
      cacheMessages([response]);
    }

    preaddMessage({ channel: `0${event.info.data.channel_id}`, message: event.info.data.id });
  }
}

export default new MessageEventHandler();
