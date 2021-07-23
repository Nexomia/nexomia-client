import { RootState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
  value: string
}

const initialState: TokenState = {
  value: localStorage.getItem('rauthid') || ''
};

export const storeSlice = createSlice({
  name: 'refreshToken',
  initialState,
  reducers: {
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      localStorage.setItem('rauthid', action.payload);
    }
  }
});

export const { setRefreshToken } = storeSlice.actions;
export const selectRefreshToken = (state: RootState) => state.refreshToken.value
export default storeSlice.reducer
