import { createStore, createEvent } from 'effector';

const setGuildChannels = createEvent<GuildChannelsInfo>();

interface GuildChannelsInfo {
  guild: string,
  channels: string[]
}

interface GuildChannels {
  [key: string]: string[]
}

const $ChannelStore = createStore<GuildChannels>({});

$ChannelStore
  .on(setGuildChannels, (state: GuildChannels, info: GuildChannelsInfo) => ({ ...state, [info.guild]: info.channels }));

export default $ChannelStore;
export { setGuildChannels };
