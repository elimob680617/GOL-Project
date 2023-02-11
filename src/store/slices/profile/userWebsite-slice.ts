import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userWebsiteState, PersonWebSiteType } from 'src/types/profile/userWebsite';
import { RootState } from 'src/store';

const initialState: userWebsiteState = {};

const slice = createSlice({
  name: 'userWebsites',
  initialState,
  reducers: {
    websiteAdded(state, action: PayloadAction<PersonWebSiteType>) {
      state.website = action.payload;
    },
    websiteCleared(state) {
      state.website = undefined;
    },
  },
});

export const userWebsiteSelector = (state: RootState) => state.userWebsites.website;

// Actions
export const { websiteAdded, websiteCleared } = slice.actions;

// Reducer
export default slice.reducer;
