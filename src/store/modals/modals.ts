import { RootState } from '../store';
import { createSlice } from '@reduxjs/toolkit';

interface ModalsStates {
  serverCreation: boolean
}

interface ModalsState {
  value: ModalsStates
}

const initialState: ModalsState = {
  value: {
    serverCreation: false
  }
};

export const storeSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    modifyModalState(state, action) {
      state.value = Object.assign(state.value, action.payload)
    }
  }
});

export const { modifyModalState } = storeSlice.actions;
export const selectModals = (state: RootState) => state.modals.value
export default storeSlice.reducer
