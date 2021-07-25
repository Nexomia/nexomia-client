import { createStore, createEvent } from 'effector-root';

const setGuildChannels = createEvent<GuildChannels>();

interface GuildChannels {
  guild: string,
  channels: Channel[]
}

interface Channel {
  id?: string,
  created?: number,
  type?: number,
  guild_id?: string,
  position?: number,
  permission_overwrites?: string[],
  name?: string,
  topic?: string,
  nsfw?: boolean,
  bitrate?: number,
  user_limit?: number,
  rate_limit_per_user?: number,
  /* recipients?: User[], */
  icon?: string,
  owner_id?: string,
  application_id?: string,
  parent_id?: string,
  pinned_messages_ids?: string[],
  last_pin_timestamp?: number,
}

const $ChannelStore = createStore({});

$ChannelStore.on(setGuildChannels, (state, info: GuildChannels) => ({ ...state, [info.guild]: info.channels }));

export default $ChannelStore;
export { setGuildChannels };
