import { createStore, createEvent } from 'effector-root';

const setChannelMessages = createEvent<ChannelMessagesInfo>();
const appendChannelMessages = createEvent<ChannelMessagesInfo>();
const addMessage = createEvent<ChannelMessageInfo>();
const clearLoadedMesssages = createEvent<string>();

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
  .on(appendChannelMessages, (state: ChannelMessages, info: ChannelMessagesInfo) => ({ ...state, [info.channel]: [ ...info.messages, ...state[info.channel] ] }))
  .on(addMessage, (state: ChannelMessages, info: ChannelMessageInfo) => (
    {
      ...state,
      [info.channel]: state[info.channel] ? state[info.channel].concat(info.message) : [info.message]
    }
  ))
  .on(clearLoadedMesssages, (state: ChannelMessages, channel: string) => (
    {
      ...state,
      [channel]: { ...state }[channel].slice(-50)
    }
  ));

export default $MessageStore;
export { setChannelMessages, appendChannelMessages, addMessage, clearLoadedMesssages };
