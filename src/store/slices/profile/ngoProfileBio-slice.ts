import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/store';

import { OrganizationUserBioInput } from 'src/types/serverTypes';

const initialState: OrganizationUserBioInput = {};

const slice = createSlice({
  name: 'ngoProfileBio',
  initialState,
  reducers: {
    bioUpdated(state, action: PayloadAction<string>) {
      state.body = action.payload;
    },
    bioCleared(state) {
      state.body = undefined;
    },
  },
});
export const bioSelector = (state: RootState) => state.ngoProfileBio.body;

// Reducer
export default slice.reducer;

// Actions
export const { bioUpdated, bioCleared } = slice.actions;
