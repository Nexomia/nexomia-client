import { configureStore } from '@reduxjs/toolkit';

import tokenSlice from './auth/token';
import refreshTokenSlice from './auth/refreshToken';
import userSlice from './users/user';
import guildsSlice from './guilds/guilds';
import modalsSlice from './modals/modals';

const store = configureStore({
  reducer: {
    token: tokenSlice,
    refreshToken: refreshTokenSlice,
    user: userSlice,
    guilds: guildsSlice,
    modals: modalsSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
