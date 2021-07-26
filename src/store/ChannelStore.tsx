import { createStore, createEvent } from 'effector-root';
import Channel from './models/Channel';

const setGuildChannels = createEvent<GuildChannelsInfo>();

interface GuildChannelsInfo {
  guild: string,
  channels: string[]
}

interface GuildChannelPath {
  guild: string,
  channel: string
}

interface GuildChannels {
  [key: string]: string[]
}

const $ChannelStore = createStore<GuildChannels>({});

$ChannelStore
  .on(setGuildChannels, (state: GuildChannels, info: GuildChannelsInfo) => ({ ...state, [info.guild]: info.channels }));

export default $ChannelStore;
export { setGuildChannels };
