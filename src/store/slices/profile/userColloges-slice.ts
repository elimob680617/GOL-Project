import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserCollegeType, profileCollegeState } from 'src/types/profile/userColleges';
import { RootState } from 'src/store';

// import { AudienceEnum } from 'src/types/serverTypes';

const initialState: profileCollegeState = {};

const slice = createSlice({
  name: 'userColleges',
  initialState,
  reducers: {
    userCollegeUpdated(state, action: PayloadAction<UserCollegeType>) {
      state.college = { ...state.college, ...action.payload };
    },
    emptyCollege(state) {
      state.college = undefined;
    },
  },
});

export const userCollegesSelector = (state: RootState) => state.userColleges.college;
// Reducer
export default slice.reducer;
// Actions
export const { userCollegeUpdated, emptyCollege } = slice.actions;
