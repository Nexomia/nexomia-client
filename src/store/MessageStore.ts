import { createStore, createEvent } from 'effector';
import getNeededMessageCount from '../utils/getNeededMessageCount';

const setChannelMessages = createEvent<ChannelMessagesInfo>();
const appendChannelMessages = createEvent<ChannelMessagesInfo>();
const addMessage = createEvent<ChannelMessageInfo>();
const preaddMessage = createEvent<ChannelMessageInfo>();
const clearLoadedMesssages = createEvent<string>();
const deleteMessage = createEvent<ChannelMessageInfo>();
const leanArray = createEvent<string>();

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
  .on(preaddMessage, (state: ChannelMessages, info: ChannelMessageInfo) => (
    {
      ...state,
      [info.channel]: state[info.channel] ? [info.message, ...state[info.channel]] : [info.message]
    }
  ))
  .on(clearLoadedMesssages, (state: ChannelMessages, channel: string) => (
    {
      ...state,
      [channel]: { ...state }[channel].slice(0 - getNeededMessageCount())
    }
  ))
  .on(deleteMessage, (state: ChannelMessages, info: ChannelMessageInfo) => {
    const modifiedChannel = { ...state }[info.channel];
    modifiedChannel.splice(modifiedChannel.indexOf(info.message), 1);

    return {
      ...state,
      [info.channel]: modifiedChannel
    };
  })
  .on(leanArray, (state: ChannelMessages, channel: string) => (
    {
      ...state,
      // @ts-ignore
      [channel]: [ ...new Set({ ...state }[channel]) ]
    }
  ));

export default $MessageStore;
export { setChannelMessages, appendChannelMessages, addMessage, preaddMessage, deleteMessage, clearLoadedMesssages, leanArray };
