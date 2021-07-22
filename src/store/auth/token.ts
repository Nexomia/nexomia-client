import { RootState } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
  value: string
}

const initialState: TokenState = {
  value: localStorage.getItem('authid') || ''
};

export const storeSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    }
  }
});

export const { setToken } = storeSlice.actions;
export const selectToken = (state: RootState) => state.token.value
export default storeSlice.reducer
