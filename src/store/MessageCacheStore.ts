import { createStore, createEvent } from 'effector';
import { cacheEmojis } from './EmojiStore';

import Message from './models/Message';
import $UserCacheStore, { cacheUsers } from './UserCacheStore';

const cacheMessages = createEvent<Message[]>();
const patchMessage = createEvent<any>();
interface MessageCache {
  [key: string]: Message
}

const $MessageCacheStore = createStore<MessageCache>({});

$MessageCacheStore
  .on(cacheMessages, (state: MessageCache, messages: Message[]) => {
    let modifiedState = { ...state };
    const UserCache = $UserCacheStore.getState();
    messages.map((message) => {
      const { user, ...cleanMessage } = message;
      modifiedState = { ...modifiedState, [message.id]: cleanMessage };
      if (user && !UserCache[user.id]) cacheUsers([user]);
      if (message.forwarded_messages) {
        message.forwarded_messages.map((message: Message) => {
          const modifiedMessage = { ...message };
          modifiedMessage.id = '$' + modifiedMessage.id;
          const { user, ...cleanModifiedMessage } = modifiedMessage;
          if (user && !UserCache[user.id]) cacheUsers([user]);
          modifiedState = { ...modifiedState, [cleanModifiedMessage.id]: cleanModifiedMessage };
          return null;
        })
      }
      if (message.emojis) {
        cacheEmojis(message.emojis);
      }
      return null;
    });
    return modifiedState;
  })
  .on(patchMessage, (state: MessageCache, patch: any) => ({
    ...state,
    [patch.id]: { ...state[patch.id], ...patch }
  }))

export default $MessageCacheStore;
export { cacheMessages, patchMessage };
