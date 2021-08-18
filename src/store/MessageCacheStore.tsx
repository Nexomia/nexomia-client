import { createStore, createEvent } from 'effector-root';

import Message from './models/Message';

const cacheMessages = createEvent<Message[]>();
const patchMessage = createEvent<any>();
interface MessageCache {
  [key: string]: Message
}

const $MessageCacheStore = createStore<MessageCache>({});

$MessageCacheStore
  .on(cacheMessages, (state: MessageCache, messages: Message[]) => {
    let modifiedState = { ...state };
    messages.map((message) => {
      modifiedState = { ...modifiedState, [message.id]: message };
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
