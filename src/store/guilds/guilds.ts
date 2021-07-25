import { RootState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Guild {
  id: string,
  name: string,
  icon: string
}

interface UserState {
  value: Guild[]
}

const initialState: UserState = {
  value: []
};

export const storeSlice = createSlice({
  name: 'guilds',
  initialState,
  reducers: {
    setGuilds: (state, action: PayloadAction<Guild[]>) => {
      state.value = action.payload;
    },

    addGuild: (state, action: PayloadAction<Guild>) => {
      state.value.push(action.payload);
    }
  }
});

export const { setGuilds, addGuild } = storeSlice.actions;
export const selectGuilds = (state: RootState) => state.guilds.value
export default storeSlice.reducer
