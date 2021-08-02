import { createStore, createEvent } from 'effector-root';

const setChannelMessages = createEvent<ChannelMessagesInfo>();
const addMessage = createEvent<ChannelMessageInfo>();

interface ChannelMessagesInfo {
  channel: string,
  messages: string[]
}

interface ChannelMessageInfo {
  channel: string,
  message: string
}

interface ChannelMessages {
  [key: string]: string[]
}

const $MessageStore = createStore<ChannelMessages>({});

$MessageStore
  .on(setChannelMessages, (state: ChannelMessages, info: ChannelMessagesInfo) => ({ ...state, [info.channel]: info.messages }))
  .on(addMessage, (state: ChannelMessages, info: ChannelMessageInfo) => (
    {
      ...state,
      [info.channel]: state[info.channel] ? state[info.channel].concat(info.message) : [info.message]
    }
  ));

export default $MessageStore;
export { setChannelMessages, addMessage };
