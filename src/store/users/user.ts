import { RootState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  id: string,
  username: string,
  discriminator: string,
  avatar: string,
  verified: boolean,
  flags: number,
  premiumType: boolean,
  publicFlags: number,
  email: string
}

interface UserState {
  value: UserInfo
}

const initialState: UserState = {
  value: {
    id: '',
    username: '',
    discriminator: '',
    avatar: '',
    verified: false,
    flags: 0,
    premiumType: false,
    publicFlags: 0,
    email: ''
  }
};

export const storeSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.value = action.payload;
    }
  }
});

export const { setUserInfo } = storeSlice.actions;
export const selectToken = (state: RootState) => state.token.value
export default storeSlice.reducer
