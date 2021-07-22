import { RootState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
  value: string
}

const initialState: TokenState = {
  value: ''
};

export const storeSlice = createSlice({
  name: 'refreshToken',
  initialState,
  reducers: {
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    }
  }
});

export const { setRefreshToken } = storeSlice.actions;
export const selectToken = (state: RootState) => state.token.value
export default storeSlice.reducer
