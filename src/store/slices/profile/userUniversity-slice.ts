import { RootState } from 'src/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserCollegeType, profileCollegeState } from 'src/types/profile/userColleges';

const initialState: profileCollegeState = {
  // colleges:[],
  // university:{
  //     audience:AudienceEnum.Public
  // }
};

const slice = createSlice({
  name: 'userUniversity',
  initialState,
  reducers: {
    userUniversityUpdated(state, action: PayloadAction<UserCollegeType>) {
      state.university = { ...state.university, ...action.payload };
    },
    emptyUniversity(state) {
      state.university = undefined;
    },
  },
});

export const userUniversitySelector = (state: RootState) => state.userUniversity.university;
// Reducer
export default slice.reducer;
// Actions
export const { userUniversityUpdated, emptyUniversity } = slice.actions;
