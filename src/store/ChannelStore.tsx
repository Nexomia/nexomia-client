import { createStore, createEvent } from 'effector-root';
import Channel from './models/Channel';

const setGuildChannels = createEvent<GuildChannelsInfo>();
const setCurrentChannel = createEvent<GuildChannelPath>();

interface GuildChannelsInfo {
  guild: string,
  channels: Channel[]
}

interface GuildChannelPath {
  guild: string,
  channel: string
}

interface GuildChannels {
  [key: string]: Channel[]
}

const $ChannelStore = createStore<GuildChannels>({});
const $CurrentChannelStore = createStore<Channel>({});

$ChannelStore
  .on(setGuildChannels, (state: GuildChannels, info: GuildChannelsInfo) => ({ ...state, [info.guild]: info.channels }))

$CurrentChannelStore.on(
  setCurrentChannel,
  (state: Channel, path: GuildChannelPath) => ({
    ...state, current: $ChannelStore.getState()[path.guild].find((channel) => channel.id === path.channel) || null
  })
);

export { setGuildChannels, setCurrentChannel, $ChannelStore, $CurrentChannelStore };
