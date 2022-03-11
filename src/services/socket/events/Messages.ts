import $ChannelCacheStore from '../../../store/ChannelCacheStore';
import $MessageCacheStore, { cacheMessages, patchMessage } from '../../../store/MessageCacheStore';
import $MessageStore, { preaddMessage, addMessage, deleteMessage } from '../../../store/MessageStore';
import { NotifyState } from '../../../store/models/Channel';
import Message from '../../../store/models/Message';
import { removeTyper } from '../../../store/TypersStore';
import { addUnread } from '../../../store/UnreadStore';
import $UserStore from '../../../store/UserStore';
import notify, { NotifyType } from '../../../utils/notify';
import MessagesService from '../../api/messages/messages.service';
import CustomMessageEvent from '../models/CustomMessageEvent';
class MessageEventHandler {
  messageCreated(event: CustomMessageEvent) {
    const MessageCache = $MessageCacheStore.getState();
    const ChannelCache = $ChannelCacheStore.getState();
    const Messages = $MessageStore.getState();
    const User = $UserStore.getState();

    const msg: Message = event.info.data;
    

    if (
      !MessageCache[msg.id] &&
      msg.author !== User.id) {
        addUnread({guildId: msg.guild_id || '@me', channelId: msg.channel_id, message_id: msg.id, countable_ids: !msg.guild_id ? [msg.channel_id] : undefined })
        if (ChannelCache[msg.channel_id]) {
          notify({
            title: msg.user?.username + ' - #' + ChannelCache[msg.channel_id].name,
            content: msg.content || '',
            image: msg.user?.avatar || '',
            type: NotifyType.NEW_MESSAGE,
            sound: 
              ChannelCache[msg.channel_id].message_notifications === NotifyState.ALL_MESSAGES
              || (
                ChannelCache[msg.channel_id].message_notifications === NotifyState.ONLY_MENTIONS
                && msg.mentions?.includes(User.id)
              )
          });
        }
      }

    if (
      MessageCache[msg.id] ||
      !Messages[msg.channel_id]?.length
    ) return;

    cacheMessages([msg]);
    addMessage({ channel: msg.channel_id, message: msg.id });
    removeTyper({ channel: msg.channel_id, user: msg.author });
  }

  messageDeleted(event: CustomMessageEvent) {
    patchMessage({ id: event.info.data.id, deleted: true });
    deleteMessage({ message: event.info.data.id, channel: event.info.data.channel_id });
  }

  async messagePinned(event: CustomMessageEvent) {
    const MessageCache = $MessageCacheStore.getState();

    if (!MessageCache[`0${event.info.data.channel_id}`]) return;
    if (!MessageCache[event.info.data.id]) {
      const response = await MessagesService.getMessage(event.info.data.channel_id, event.info.data.id);
      cacheMessages([response]);
    }

    preaddMessage({ channel: `0${event.info.data.channel_id}`, message: event.info.data.id });
  }
}

export default new MessageEventHandler();
