import { RootState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
};

interface ChannelsState {
  value: any
};

interface GuildChannelsPayload {
  guild: string,
  channels: Channel[]
};

const initialState: ChannelsState = {
  value: {}
};

export const storeSlice = createSlice({
  name: 'guilds',
  initialState,
  reducers: {
    setGuildChannels: (state, action: PayloadAction<GuildChannelsPayload>) => {
      state.value[action.payload.guild] = action.payload.channels;
    },

    /* addChannel: (state, action: PayloadAction<Channel>) => {
      state.value.push(action.payload);
    } */
  }
});

export const { setGuildChannels } = storeSlice.actions;
export const selectGuilds = (state: RootState) => state.guilds.value
export default storeSlice.reducer
