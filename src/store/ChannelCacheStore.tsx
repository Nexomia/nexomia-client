import { createStore, createEvent } from 'effector-root';

import Channel from './models/Channel';

const cacheChannels = createEvent<Channel[]>();

interface ChannelCache {
  [key: string]: Channel
}

const $ChannelCacheStore = createStore<ChannelCache>({});

$ChannelCacheStore
  .on(cacheChannels, (state: ChannelCache, channels: Channel[]) => {
    let modifiedState = { ...state };
    channels.map((channel) => {
      modifiedState = { ...modifiedState, [channel.id]: channel };
    });
    return modifiedState;
  })

export default $ChannelCacheStore;
export { cacheChannels };
