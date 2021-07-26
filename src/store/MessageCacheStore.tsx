import { createStore, createEvent } from 'effector-root';

import Message from './models/Message';

const cacheMessages = createEvent<Message[]>();

interface MessageCache {
  [key: string]: Message
}

const $MessageCacheStore = createStore<MessageCache>({});

$MessageCacheStore
  .on(cacheMessages, (state: MessageCache, messages: Message[]) => {
    let modifiedState = { ...state };
    messages.map((message) => {
      modifiedState = { ...modifiedState, [message.id]: message };
    });
    return modifiedState;
  })

export default $MessageCacheStore;
export { cacheMessages };
